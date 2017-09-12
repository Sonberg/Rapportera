
import moment from 'moment';

exports.timeDuration = function (start, end) {
  var ms = moment(end).diff(moment(start));
  var d = moment.duration(ms);

  return moment.utc(d.asHours()).format('HH') + moment.utc(d.asMilliseconds()).format(":mm")
}


exports.formatTime = function(date) {
    return moment(date).format('HH:mm DD/MM');
  }
