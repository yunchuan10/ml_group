/**
 *
 * 鼠标拖动选中单元格
 */

let scrollTop = 0; // 滚动条位置

// 固定表头
// window.onload = function () {
//   let tableCont = document.querySelector('#table-cont')
//   function scrollHandle(e) {
//     scrollTop = this.scrollTop;
//     this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
//   }
//   tableCont.addEventListener('scroll', scrollHandle)
// }
function setScrollHandle(){
  scrollTop = 0;
  function scrollHandle(e) {
    scrollTop = this.scrollTop;
    // this.querySelector('thead').style.transform = 'translateY(' + scrollTop + 'px)';
  }
  let tableCont = document.querySelector('#table-cont');
  if( tableCont ) {
    scrollTop = tableCont.scrollTop;
    tableCont.removeEventListener("scroll", scrollHandle);
  }
  tableCont.addEventListener('scroll', scrollHandle);
}

// 鼠标选择
const mouse = event => {
  return new Promise((resolve, reject) => {

    setScrollHandle();

    let e = event || window.event;
    let startX = e.pageX;
    let startY = e.pageY;
    let selList = [];
    let fileNodes = document.getElementsByTagName('td');
    for (let value of fileNodes) {
      if (value.className.indexOf('fileDiv') !== -1) selList.push(value);
    }
    let isSelect = true;
    let selDiv = document.createElement('div');
    selDiv.style.cssText = 'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;';
    selDiv.id = 'selectDiv';
    document.body.appendChild(selDiv);
    selDiv.style.left = `${startX}px`;
    selDiv.style.top = `${startY - scrollTop}px`;
    let _x = null, _y = null;

    event.target && (event.target.className = 'fileDiv seled')

    // 鼠标移动中选中单元格
    document.onmousemove = event => {
      e = event || window.event;
      if (isSelect) {
        if (selDiv.style.display === 'none') selDiv.style.display = '';
        _x = e.pageX;
        _y = e.pageY;
        selDiv.style.left = `${Math.min(_x, startX)}px`;
        selDiv.style.top = `${Math.min(_y, startY)}px`;
        selDiv.style.width = `${Math.abs(_x - startX)}px`;
        selDiv.style.height = `${Math.abs(_y - startY)}px`;
      }
      if (selDiv) {
        let _l = selDiv.offsetLeft, _t = selDiv.offsetTop, _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
        for (let value of selList) {
          let sl = value.offsetLeft + value.offsetParent.offsetParent.offsetLeft;
          let sr = value.offsetWidth + value.offsetLeft + value.offsetParent.offsetParent.offsetLeft;
          let st = value.offsetTop + value.offsetParent.offsetParent.offsetTop - scrollTop;
          if (sl < _l && sr > _l + _w && st < _t + _h && (_t - st) < value.offsetHeight) {
            if (value.className.indexOf('seled') === -1) value.className = `${value.className} seled`;
          } else {
            if (value.className.indexOf('seled') !== -1) value.className = 'fileDiv';
          }
        }
      }
    };

    // 鼠标松开回调数据
    document.onmouseup = () => {
      isSelect = false;
      if (selDiv) document.body.removeChild(selDiv);
      selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, e = null;
      divHandler(fileNodes, resolve, reject);
    }
  })
}

// 返回选中数据
const divHandler = (fileNodes, resolve, reject) => {
  let list = [];
  for (let value of fileNodes) {
    if (value.className.indexOf('seled') !== -1) {
      list.push({
        name: value.getAttribute('data-name'),
        period: value.getAttribute('data-period'),
        id: value.getAttribute('data-id') ,
        meetName: value.getAttribute('date-meet') ,
        start: value.getAttribute('data-start') ,
        end: value.getAttribute('data-end') ,
        board: value.getAttribute('data-board') ,
      });
    }
  }
  resolve(list);
}

export default mouse;