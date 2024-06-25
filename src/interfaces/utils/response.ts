const headersCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true
}

const response = {
  statusCode: 500,
  headers: headersCors,
  body: undefined
}

function setStatus(statusCode: number) {
	statusCode ? response.statusCode = statusCode : response.statusCode = 500
}

function setBody(body: any) {
	body
		? response.body = JSON.stringify(body)
		: delete response.body
}

function setHeaders(headers: object) {
	headers ? response.headers = {...headersCors, ...headers} : response.headers = headersCors
}

function set(statusCode?: number, body?: any, headers?: object) {
	setHeaders(headers)
	setStatus(statusCode)
	setBody(body)
}

function send() { return response }

export default {set, send}
