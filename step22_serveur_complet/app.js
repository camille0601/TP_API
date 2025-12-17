/*
const http = require('http'); 
const url = require('url');
// pour ne pas utiliser les require et faire des import à la place, il faut :
    * soit renomer app.js en app.mjs
    * soit avoir un fichier package.json avec le "type":"module"
*/
import http from "node:http"
import url from "node:url"
import fs from 'node:fs';
import { dirname } from "node:path";
import ejs from 'ejs';
import path from "path";


app.use(express.static(path.join(__dirname, 'tmpl')));

const SERVER_PORT = 8080;

// création du serveur
const server = http.createServer();

// lancement du serveur
server.listen(SERVER_PORT, 'localhost');
server.on('listening', function () {
    console.log(`Serveur démarré à http://localhost:${SERVER_PORT}/ 🚀!`)
});

//récupération du répertoire de template
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const template_folder = __dirname + '\\tmpl';

//gestion des pages
server.on('request', function (request, response) {
    const pageUrl = url.parse(request.url, true);
    console.log(`URL demandée : ${request.method} ${request.url}.`);

    response.setHeader('Content-Type', "text/html; charset=UTF-8");

    let isAdmin = null;
    if (pageUrl.query.isAdmin != undefined) {
        response.setHeader('Set-Cookie', 'isAdmin=' + pageUrl.query.isAdmin);
        isAdmin = pageUrl.query.isAdmin === 'true'
    }

    const parsedCookie = parseCookies(request)
    isAdmin = isAdmin ?? parsedCookie.isAdmin

    switch (pageUrl.pathname) {
        case '/home':
        case '/':
            // ne marche pas
            /*
            const content = ejs.renderFile(template_folder +'/tmplEJS/page.ejs', templateData, {}, (err, str) => {
                return str;
            })
            response.end(content);
            */
            const templateData = {
                isAdmin,
                header: {
                    title: 'HOME'
                },
                body: {
                    header: '<h1>Bienvenue !</h1>',
                    main: '<p>Ceci est mon site fait avec EJS.</p>',
                }
            }
            // Asynchrone
            ejs.renderFile(path.join(template_folder, 'page.ejs'), templateData, {}, (err, str) => {
                if (err) {
                    console.error(err);
                    return
                }
                response.end(str);
            })
            break;
        case '/aboutMe':
            // sans test d'erreur
            ejs.renderFile(path.join(template_folder, 'aboutMe.ejs'), { title: 'about Me !' }, (err, str) => {
                response.end(str);
            });
            break;
        case '/bugUtf8':
            // Synchrone condensé
            response.end(fs.readFileSync(path.join(template_folder, 'bugUtf8.html')));
            break;
        case '/test.php':
            response.end(`Est-ce bien une page PHP 🤔 ?`);
            break;

        default: {
            fs.readFile(path.join(template_folder, 'NotFound.ejs'), function (err, content) {
                response.statusCode = 404;
                response.end(content);
            })
            console.log('pageNotFound')
        }
    }
});

console.log(`thread principal terminé`)


function parseCookies(request) {
    const list = {},
        rc = request.headers.cookie + ';';

    rc && rc.split(';').forEach(function (cookie) {
        if (cookie) {
            const parts = cookie.split('=');
            const value = ['true', 'false'].includes(parts[1]) ? parts[1] === 'true' : parts[1];
            list[parts[0].trim()] = value;
        }
    });

    return list;
}
