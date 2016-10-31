var config = require('../v2/config'),
	Promise = require('bluebird'),
	nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
    host: config.smtp.host,
    secureConnection: config.smtp.secure,
    port: config.smtp.port,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
});


var getTemplate = function (opts) {

	var get = function(_opts) {
		_opts = _opts || {};
		if (_opts.name) {
			return db('EmailTemplates').where('Name', _opts.name).first();
		}
		else if (_opts.profileID) {
			return db('EmailTemplates').where('ProfileID', _opts.profileID).first();
		}
		else if (_opts.ID) {
			return db('EmailTemplates').where('ID', _opts.ID).first();
		}
		else {
			return getTemplate({ name: config.email.defaultTemplate })
		}
	};

	return new Promise(function (resolve, reject) {

		get(opts).then(function (template) {
			if (template) {
				// TODO: cache
				resolve(template);
			}
			else {
				return get().then(resolve);
			}
		})
		.catch(reject);

	})
};


var Email = {

	//
	// Sends a single email
	//
	send: function (opts) {
		return new Promise(function (resolve, reject) {

			// check all required params
			if (!opts.to) {
				reject('Please specify a \'to\' address to receive this email');
			}

			// ignore emails to test/temp addresses
			else if (
				opts.to.indexOf('@actemp') > 0 ||
				opts.to.indexOf('@test') > 0 ||
				opts.to.indexOf('dev-') === 0 ||
				opts.to.indexOf('x-') === 0
			) {
				resolve();
			}
			else {

				var send = function (html, text) {
					var mailOptions = {
						from: opts.from || config.email.noReply,
						replyTo: opts.replyTo,
						to: opts.to,
						cc: opts.cc,
						bcc: opts.bcc,
						subject: opts.subject,
						html: html,
						text: text,
						replyTo: opts.replyTo
					};

					transport.sendMail(mailOptions, function (err, response) {
						if (err) {
							reject(err);
						}
						else {
							resolve(response);
						}
					});
				};

				if (opts.text) {
					send(undefined, opts.text);
				}
				else if (opts.html) {
					getTemplate(opts.template).then(function (template) {

						var body =
							template.HTML.replace(/\[BODY]/, opts.html) +
							(template.CSS ? '<style>' + template.CSS + '</style>' : '');

						send(body);
					})
				}
				else {
					reject('Please specify an email body (text or html)');
				}

			}

		});
	}

};


module.exports = Email;