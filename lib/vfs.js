function VFS() {
    if (!(this instanceof VFS)) {
        return new VFS();
    }

    this.stack = [];
}

VFS.prototype.use = function(prefix, adapter) {
    if (typeof prefix === 'object') {
        if (typeof prefix.test !== 'function') {
            // Assume it's our adapter
            adapter = prefix;
            prefix = null;
        }
    } else if (typeof prefix === 'string') {
        prefix = new RegExp('^' + prefix);
    }

    this.stack.push({
        prefix: prefix,
        adapter: adapter
    });

    return this;
};

VFS.prototype._compileIterator = function(name, args) {
    return function iterator(elem) {
        if (elem.prefix && !elem.prefix.test(args[0])) {
            return false;
        }

        var handled = elem.adapter[name].apply(elem.adapter, args);

        return handled || elem.prefix;
    };
};

VFS.prototype.exists = function(path, callback) {
    this.stack.some(this._compileIterator('exists', arguments));
};

VFS.prototype.readFile = function(path, encoding, callback) {
    this.stack.some(this._compileIterator('readFile', arguments));
};

VFS.prototype.writeFile = function(path, data, encoding, callback) {
    this.stack.some(this._compileIterator('writeFile', arguments));
};

VFS.prototype.unlink = function(path, callback) {
    this.stack.some(this._compileIterator('unlink', arguments));
};

VFS.prototype.rmdir = function(path, callback) {
    this.stack.some(this._compileIterator('rmdir', arguments));
};

VFS.prototype.mkdir = function(path, mode, callback) {
    this.stack.some(this._compileIterator('mkdir', arguments));
};

VFS.prototype.appendFile = function(path, data, encoding, callback) {
    this.stack.some(this._compileIterator('appendFile', arguments));
};

module.exports = VFS;
