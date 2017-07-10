let helper = require('sendgrid').mail;
var sendEmail = require('./send');

module.exports.send = function(args, cb) {
  var to_email = args[0];

  var mail = new helper.Mail();
  var personalization = new helper.Personalization();

  // Set from_email
  var email = new helper.Email('cody@serenadedates.com', 'Serenade Dates');
  mail.setFrom(email);

  // Set reply_to email
  email = new helper.Email('cody@serenadedates.com', 'Cody Anderson');
  mail.setReplyTo(email);

  // Set to_email
  email = new helper.Email(to_email);
  personalization.addTo(email);

  // Set Subject
  mail.setSubject('Thanks for Signing Up!'); // This replaces the <%subject%> tag inside your SendGrid template

  // Set content
  var content = new helper.Content('text/html', ' '); // This replaces the <%body%> tag inside your SendGrid template
  mail.addContent(content);

  // Set template_id
  mail.setTemplateId('21d52629-039c-4cae-a7eb-4e5552521ba9');

  // Add all personalizations to mail object
  mail.addPersonalization(personalization);

  // Convert mail object to JSON format
  mail = mail.toJSON();

  // Send the email
  sendEmail.send(mail, cb);
};
