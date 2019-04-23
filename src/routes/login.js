const router = require('express').Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

router.post('/login', (req, res) => {

    const { email, password } = req.body;

    const savedEmail = email;
    const savedPassword = password;
    const checkedEmail = validator.blacklist(email, `$`);
    const checkedPassword = validator.blacklist(password, '$');

    if (!validator.equals(checkedEmail, savedEmail) && !validator.equals(checkedPassword, savedPassword)) {
        res.send({
            done: false,
            msg: 'You put forbidden chars in the inputs!'
        })
    } else {
        User.findOne({
            email: checkedEmail
        }).then(user => {
            if (!user) {
                res.send({
                    done: false,
                    msg: 'This email is not registered!'
                })
            } else {
                const userPassword = user.password;
                bcrypt.compare(checkedPassword, userPassword, (error, validated) => {
                    if (error) {
                        res.send({
                            done: false,
                            msg: 'Something went wrong! Try again!'
                        })
                    }
                    if (!validated) {
                        res.send({
                            done: false,
                            msg: 'Bad password! Try again!'
                        })
                    } else {
                        const payload = {
                            email: user.email
                        };
                        const token = jwt.sign(payload, process.env.SECRET_OR_KEY)
                        res.send({
                            done: true,
                            msg: 'Successfully logged in!',
                            token
                        })
                    }
                })
            }
        })
    }
})

module.exports = router;