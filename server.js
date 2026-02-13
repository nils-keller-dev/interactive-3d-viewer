import { serveDir } from 'jsr:@std/http@1/file-server';

Deno.serve({
	port: 8000,
	onListen: ({ port, hostname }) =>
		console.log(`Server running at http://${hostname}:${port}/`),
}, (req) => serveDir(req, { fsRoot: '.' }));
