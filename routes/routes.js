const express = require('express');
const Router = express.Router();
const Controller = require('./../Controllers/NotesController');
Router.route('/').get(Controller.index);
Router.route('/about').get(Controller.about);
Router.route('/login').get(Controller.login).post(Controller.loginUser);
Router.route('/signin').get(Controller.signin).post(Controller.createUser);
Router.route('/addnotes')
  .get(Controller.checkAuthenticate, Controller.addNote)
  .post(Controller.checkAuthenticate, Controller.createNotes);

Router.route('/home').get(Controller.checkAuthenticate, Controller.logIn);
Router.route('/redirect-success').get(Controller.success);
Router.route('/dashboard').get(
  Controller.checkAuthenticate,
  Controller.dashboard
);
Router.route('/logout').get(Controller.logout);
Router.route('/forgotpassword')
  .get(Controller.forgotpassword)
  .post(Controller.resetTokenSend);
Router.route('/reset/:token')
  .get(Controller.updatePassword)
  .post(Controller.resetPassword);

Router.route('/edit/:id').get(Controller.edit).put(Controller.updateNotes);
Router.route('/delete/:id').get(Controller.deleteNote);
Router.route('/sentmail').get(Controller.sentmail);
module.exports = Router;
