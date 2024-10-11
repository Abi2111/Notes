const User = require('../Models/userModel');
const passport = require('passport');
const Notes = require('./../Models/notesSchema');
const crypto = require('crypto');
const sendmail = require('./../Utils/sendMail');

// Authentication middleware

exports.checkAuthenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

exports.signin = (req, res) => {
  res.render('signin');
};

exports.index = (req, res) => {
  if (req.user) {
    req.logout(function (err) {
      return res.render('index');
    });
  }
  res.render('index');
};

exports.about = (req, res) => {
  res.render('about');
};

exports.login = (req, res) => {
  res.render('login');
};

exports.addNote = (req, res) => {
  const id = req.user._id;
  res.render('addnote', { id });
};

exports.home = (req, res) => {
  res.render('home');
};

exports.forgotpassword = (req, res) => {
  res.render('forgotpassword');
};
exports.sentmail = (req, res) => {
  res.render('mailsent');
};
exports.edit = async (req, res) => {
  const id = req.params.id;
  const details = await Notes.findOne({ _id: id });
  res.render('edit', { details, id });
};
exports.updatePassword = (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.redirect('/forgotpassword');
  }
  res.render('updatePasswod', { token });
};
exports.dashboard = async (req, res) => {
  const email = req.user.email;
  let name = req.user.name;
  let id = req.user._id;
  let data = await Notes.find({ email });
  const modified = data.map(note => {
    return {
      id: note._id,
      title: note.title,
      notes: note.notes.split(' ').slice(0, 20).join(' '),
    };
  });

  res.render('dashboard', { modified, name, id });
};

// Creating User

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'Failed',
        error: 'All fields are required ',
      });
    }

    const curUser = await User.findOne({ email });
    if (curUser) {
      return res.status(400).json({
        status: 'Failed',
        error: 'User already exists ',
      });
    }
    const newUser = { name, email };
    User.register(newUser, password, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating user' });
      }
      passport.authenticate('local')(req, res, () => {
        res.status(201).json({
          status: 'Success',
        });
      });
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      error: error.message,
    });
  }
};

// Login user

exports.loginUser = passport.authenticate('local', {
  successRedirect: '/redirect-success',
  failureRedirect: '/login',
});

exports.success = (req, res) => {
  if (req.isAuthenticated()) {
    const name = req.user.name;
    return res.redirect(`/home?name=${name}`);
  }
  res.redirect('/login');
};
exports.logIn = async (req, res) => {
  let name = req.query.name || 'User';
  let email = req.email || 'User';
  let data = await Notes.find({ email });
  console.log(data);

  const id = req.user._id;
  res.render('main', { name, id });
};
//  Logout User

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
    }
    res.redirect('/');
  });
};

// creating notes
exports.createNotes = async (req, res) => {
  try {
    const { heading, note } = req.body;
    if (!heading || !note) {
      return res.redirect('/home');
    }

    // const user = await User.findOne({ _id: id });
    console.log('form notes', req.user);
    const email = req.user.email;

    const notes = {
      email,
      title: heading,
      notes: note,
    };

    await Notes.create(notes);
    res.redirect('/home');
  } catch (error) {}
};

//  forgot password link

exports.resetTokenSend = async (req, res) => {
  try {
    const token = crypto.randomBytes(30).toString('hex');
    const email = req.body.email;
    if (!email) {
      return res.redirect('/login');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/signin');
    }

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpire = Date.now() + 1800000;

    await user.save();

    const options = {
      email,
      subject: 'reset password request',
      text: `Dear user,you have requested a password reset on${new Date().toLocaleString()}. If you want to reset your password, please click on below link \n\n http://${
        req.headers.host
      }/reset/${token}\n\n\n if you are not requested please ignore`,
    };

    await sendmail(options);

    res.redirect('/sentmail');
  } catch (error) {}
};

exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password, repassword } = req.body;

  if (password !== repassword) {
    return res.redirect('/forgotpassword');
  }
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect('/forgotpassword');
  }

  user.setPassword(password, async function (err) {
    if (err) {
      return res.redirect('/forgotpassword');
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    try {
      await user.save();
      res.redirect('/login');
    } catch (error) {}
  });
};
exports.updateNotes = async (req, res) => {
  try {
    const id = req.params.id;
    const { note, heading } = req.body;
    const notes = { title: heading, notes: note };
    const data = await Notes.findByIdAndUpdate(
      { _id: id },
      { $set: notes },
      { new: true, runValidators: true }
    );
    await data.save();

    res.redirect('/dashboard');
  } catch (error) {}
};

exports.deleteNote = async (req, res) => {
  const id = req.params.id;
  await Notes.findByIdAndDelete({ _id: id });

  res.redirect('/dashboard');
};
