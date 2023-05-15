const server = require("http").createServer();
const express = require('express');
const app = express();
const morgan = require('morgan');
const IO = require('socket.io')
const stream = require('stream');
const body_parser = require("body-parser");
const cors = require("cors");
const { Logger } = require("yalls");
const fs = require("fs");

const config = require("./config.json");

const Game = require("./Game.js");

const log = Logger.console(config.log.namespace || "tasking-manager", config.log);
log.set_log_level(config.log.level || "debug");


// A stream to pipe morgan (http logging) to bunyan
let info_log_stream = new stream.Writable()
info_log_stream._write = (chunk, encoding, done) => {
  log.info(chunk.toString().replace(/^[\r\n]+|[\r\n]+$/g, ""));
  done();
};

(async () => {
  // Set up webservice
  server
    .on("request", app)
    .on("listening", () => log.info(`webservice listening on ${server.address().address}:${server.address().port}`));

  app
    .use(cors())
    .use(express.json()) // Middleware for POST body parsing (use application/json)
    .use(body_parser.urlencoded({
      extended: false
    })) // Middleware for POST body parsing (use x-www-form-urlencoded). We would like to use this on a per-router basis, but it inhibits our ability to check body auth (below)
    // .use(Auth.meddle)   // Check auth

    .use(morgan(':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms', {
      "stream": info_log_stream
    })) // Morgan HTTP logging
    .use("/", express.static("webapp/public")); // serve index.html on `GET /`


  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    next();
  });


  app.get("/images/", (req, res) => {
    fs.readdir("webapp/public/images", (err, files) => {
      if (!err) {
        res.send(files.filter((f) => f.endsWith(".png")));
      } else {
        res.send([]);
      }

  });
});
 
  // Set up socket.io server
  let io_server = IO(server);
  let game = new Game(log.create_child("game"));

  setInterval(() => {
    log.debug(`Update FPS: ${1000/game.update_rate}`)
  }, 2000)

  io_server
  .on('connection', (sock) => {
    sock.on("register_viewport", (vp) => {
        log.info(`Registering viewport: ${vp.center.x}, ${vp.center.y}, ${vp.size.x}, ${vp.size.y}`)
        game.add_remote_viewport(sock, vp);
    });

    sock.on("register_team", (team) => {
      log.info(`Registering team: ${team.name}`)
      game.register_team(sock, team);
    });

    sock.on("get_players", (cb) => {
      let e = game.get_entities_for_sock(sock);
      cb(e.map((e) => e.serialize()));
    });
  })

  game.on("registration_opened", () => {
    log.info("Registration opened");
    io_server.local.emit("registration_opened");
  });

  // Fire up the bass cannon
  server.listen(config['webservice'].port, config['webservice'].address);

})().catch((e) => {

  log.error(e.stack);

});
