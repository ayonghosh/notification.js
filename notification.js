/*
 * Browser notification plugin.
 * Author: Ayon Ghosh
 * Version: 1.0
 * Date: 4 November 2013
 */

// notification object
var Notification = function (iconUrl, title, body) {
	this.id = new Date().getTime();
	this.iconUrl = iconUrl ? iconUrl : '';
	this.title = title ? title : '';
	this.body = body ? body : '';
	
	/*
	 * Notification markup:
	 
		<div class="notification"> 
			<div class="icon"><img src=" + this.iconUrl + "/></div> 
			<div class="note"> 
				<div class="close">&#215</div>
				<div class="title"> + this.title + </div> 
				<div class="body"> + this.body + </div> 
			</div> 
		</div>;
	*/
	
	// create DOM structure
	var docFrag = document.createDocumentFragment();
	var closeBtn = this.createDiv('close', '&#215');
	var icon = this.createDiv('icon');
	icon.appendChild(this.createIcon(this.iconUrl));
	var note = this.createDiv('note');
	note.appendChild(this.createDiv('title', this.title));
	note.appendChild(this.createDiv('body', this.body));
	note.appendChild(closeBtn);
	docFrag.appendChild(icon);
	docFrag.appendChild(note);
	
	// the root div element
	this.el = this.createDiv('notification');
	this.el.appendChild(docFrag);
	
	
	var _this = this;
	// handle close button click event
	this.addEventHandler(closeBtn, 'click', function (evt) {
		// prevent 'click' bubbling
		if (evt.stopPropagation) {
			evt.stopPropagation();
		}else {
			evt.cancelBubble = true;
		}
		_this.close();
	});
	
	// handle general click events on notification
	this.addEventHandler(this.el, 'click', function (evt) {
		// prevent 'click' bubbling
		if (evt.stopPropagation) {
			evt.stopPropagation();
		}else {
			evt.cancelBubble = true;
		}
		if (_this.onclick) {
			_this.onclick();
		}
	});
};

// create a div with particular selector class and inner HTML
Notification.prototype.createDiv = function (className, html) {
	var div = document.createElement('div');
	div.className = className;
	if (html) {
		div.innerHTML = html;
	}
	
	return div;
};

// create an img element
Notification.prototype.createIcon = function(iconUrl) {
	var img = document.createElement('img');
	img.src = iconUrl;
	
	return img;
};

// add event handler to an element (cross browser)
Notification.prototype.addEventHandler = function (el, evt, handler) {
	if (el.addEventListener) {
		el.addEventListener(evt, handler);
	}else if (el.attachEvent) {
		el.attachEvent('on' + evt, handler);
	}
};

// show the notification
Notification.prototype.show = function () {
	document.body.appendChild(this.el);
	
	var bottom = (notifications.getCount() - 1) * (this.el.offsetHeight + 10) + 10;
	this.el.style.bottom = bottom + 'px';
	
	var right = -this.el.offsetWidth;
	this.el.style.right = right + 'px';
	var _this = this;
	
	function animateShow() {
		if (right < 10) {
			setTimeout(animateShow,10);
			_this.el.style.right = right + 'px';
			right += 60;
		}else {
			_this.el.style.right = '10px';
			if (_this.onshow) {
				_this.onshow();
			}
		}
	};
	animateShow();
};

// cancel the notification and release memory
Notification.prototype.cancel = function () {
	//this.close();
	// destroy
	document.body.removeChild(this.el);
	this.el = null;
};

// close the notification
Notification.prototype.close = function () {
	notifications.remove(this.id);
	
	var _this = this;
	var opacity = 1.0;
	
	function animateClose() {
		if (opacity > 0) {
			setTimeout(animateClose, 10);
			_this.el.style.opacity = opacity;
			opacity -= 0.1;
		}else {
			_this.el.style.display = 'none';
			if (_this.onclose) {
				_this.onclose();
			}
			_this.cancel();
		}
	};
	animateClose();
};

// drop the notification vertically
Notification.prototype.drop = function () {
	var bottom = parseInt(this.el.style.bottom);
	var newBottom = (bottom - this.el.offsetHeight - 10);
	
	var _this = this;
	function animateDrop() {
		if (bottom > newBottom) {
			setTimeout(animateDrop, 10);
			bottom -= 20;
			_this.el.style.bottom = bottom + 'px';
		}else {
			_this.el.style.bottom = newBottom + 'px';
		}
	};
	animateDrop();
};


// notification manager interface
var notifications = function () {
	// here be privates...
	
	// the notification queue
	var q = {};
	// notification count
	var ncount = 0;

	function create(iconUrl, title, body) {
		// create notification
		var note = new Notification(iconUrl, title, body);
		// push to queue
		q[note.id] = note;
		ncount++;
		
		return note;
	};
	
	function update(id, options) {
		// TODO
	};
	
	function clear(id, callback) {
		// TODO
	};
	
	function getAll(callback) {
		// TODO
	};
	
	function remove(id) {
		// delete notification
		delete q[id];
		ncount--;
		
		// drop all notifications above
		// the currently deleted one
		var prop;
		for (prop in q) {
			if (prop > id) {
				q[prop].drop();
			}
		}
	};
	
	function getCount() {
		return ncount;
	};
	
	// public API
	return {
		createNotification: create, 
		getCount: getCount, 
		remove: remove
	};
}();

