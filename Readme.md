#notification.js

A reusable JavaScript plugin that mimics webkit notifications. Based on the W3C Web Notification API specs: http://www.w3.org/TR/notifications/

Include the notification.js script and the notification.css stylesheet in your page. You can then use the notification manager to create notifications:

`var notification = notifications.createNotification(iconUrl, title, body);`

The following event handlers are supported:

* `onclick` - Triggered when a notification is clicked
* `onshow`  - Triggered when a notification is displayed
* `onclose` - Triggered when a notification is closed by the user

Check out working demo here: http://intellisol.herokuapp.com/notificationdemo.html