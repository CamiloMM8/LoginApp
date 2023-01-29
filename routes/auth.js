const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();




router.post ('/new', [
    check('name','El nombre debe tener entre 3 a 20 caracteres').isLength({min:3,max:20}),
    check('email','El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener entre 6 a 30 caracteres').isLength({min:6},{max:30}),
    validarCampos
],crearUsuario)

router.post ('/', [
    check('email','El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({min:6}),
    validarCampos
],loginUsuario)

router.get ('/renew', validarJWT,revalidarToken)


module.exports = router;