var fs = require('fs');
var path = require('path');
var settings = require('../settings');
var utility = require('./utility');
var AI = require('../models/ai');
var User = require('../models/user');

var processUpload = function(ai) {
    var type = ai.type;
    var size = ai.size;

    if (type !== 'application/zip' || !size || size > 50*1024*1024) {
        try {
            fs.unlinkSync(ai.path);
        } catch (err) {
            console.log('cannot remove [%s]', ai.path);
        }
        
        if (type !== 'application/zip') return {err:'Not a zip file'};
        if (!size) return {err:'Empty file'};
        if (size > 50*1024*1024) return {err:'File size > 50MBytes'};
    } else {
        var str = utility.generateRandomString() + Date.now();
        var ext = '.zip';
        var newpath = path.join(settings.uploadPath, str + ext);
        try {
            fs.renameSync(ai.path, newpath);
        } catch (err) {
            console.log('cannot rename [%s] to [%s]', ai.path, newpath);
            console.log(err);
            return {err:'Cannot rename zip file'};
        }
        return { err: null, abspath: newpath };
    }
}

exports.showUpload = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    var info = utility.prepareRenderMessage(req);
    info.title = "Upload AI";
    res.render('ai_upload', info);
};

exports.execUpload = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    res.locals.message = res.locals.message || [];
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.actionUrl = '/ai/upload';
        info.title = "Upload AI";
        return res.render('ai_upload', info);
    };

    if (typeof(req.files) === 'undefined' || typeof(req.files.ai) === 'undefined') {
        return fallback(['No zip file was uploaded']);
    }
    var ai = processUpload(req.files.ai);
    if (ai.err) {
        return fallback([ai.err]);
    }

    AI.getidOfUser(req.session.user.name, function(id) {
        var info = {
            user: req.session.user.name,
            idOfUser: id,
            absPath: ai.abspath
        }
        var item = new AI(info);
        item.save(function(err, saved) {
            if (err) return fallback(['Unknown Error']);
            res.redirect('/ai/' + saved.id);
        });
    });
};