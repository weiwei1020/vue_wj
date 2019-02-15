/*
/!**
 * 加载
 *!/
import iView from 'iview';

function toasts(message) {
  // iView.Modal.success({
  //   title: '提示',
  //   content: message
  // });
  iView.Notice.error({
    title: '提示',
    desc:message,
    duration: 5
  });
 // iView.Message.warning(message)
  // vue.$iView.Message.error('对方不想说话，并且向你抛出了一个异常');
}

var toast = {
  show: function (type, message) {
    console.log('===message==' + message)
    var finalMessage = message;
    if (!finalMessage) {
      switch (type) {
        case 1000:
          finalMessage = '没有权限';
          break;
        case -201:
          finalMessage = '没有用户';
          break;
        case -1:
          finalMessage = '没有权限';
          break;
        default:
          finalMessage = '网络错误';
          break;
      }
      finalMessage += type;
    }
    toasts(finalMessage);
  },

  showMessage: function (message) {
    toasts(message);
  },

  showLoading: function (show) {
    if (show) {
      iView.LoadingBar.start();
    } else {
      iView.LoadingBar.finish();
    }
  }
};

export default {
  toast
}
*/
