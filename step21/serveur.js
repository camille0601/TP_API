import http from "http";
import { url } from "node:inspector";
import { URL } from "node:url";
import url from "url";
const server = http.createServer();

server.listen(4000, "localhost");
server.on("listening", () => console.log("Serveur démarré !"));
server.on("request", (req, res) => {
  console.log("URL demandée : %s %s", req.method, req.url);
  console.log("");
  const url = req.url;
  console.log(url);

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Home Page</h1><a href='/contact'>contact</a> <a href='/about'>autre page</a>");
} else if (url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Page de contact</h1><a href='/'>home</a> <a href='/about'>autre page</a>");
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Page non trouvée</h1><a href='/'>home</a>");
  }
});
