<template>
  <div v-show="isImgNotes">
    <!--左侧仪器树-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">仪器位置列表</p>
            <p slot="title" style="width: 40%;text-align: right">
              <a @click="_refresh">
                <Icon type="refresh" size="20"></Icon>
              </a>
            </p>
            <div>
              <LocationTree ref="classTree" @on-result-change="_locationData"></LocationTree>
            </div>
          </Card>
        </div>
        <div style="position: absolute;left: 196px;top:250px;cursor:pointer" @click="_treeHide" v-if="isTree">
          <div class="navbarImgShow"></div>
        </div>
        <div style="position: absolute;left:10px;top: 250px;cursor:pointer" @click="_treeShow" v-else="isTree">
          <div class="navbarImgHide"></div>
        </div>
        <!--右侧-->
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24" style="margin-top: -10px;">
            <div id="imgToolbar">
              <Button type="success" id="equip_info_point_add" shape="circle" v-if="$showBtn('equip_info_point_add')"
                      :key="添加">添加
              </Button>
              <Button type="warning" id="equip_info_point_lock" shape="circle" v-if="$showBtn('equip_info_point_lock')"
                      :key="锁定">锁定
              </Button>
              <Button type="primary" id="equip_info_point_save" shape="circle" v-if="$showBtn('equip_info_point_save')"
                      :key="保存" @click.native="_saveData">保存
              </Button>
            </div>
            <div id="canvas">
              <img :src="imgUrl" width="800"/>
            </div>
            </Col>
          </Row>
        </div>
        <!---右侧-->
      </div>
    </div>
    <!--选择仪器-->
  </div>
</template>

<script>
  /**
   * 仪器资产信息表详情
   */
  var dataList;
  var locationId;
  var TableList = [];
  import axios from 'axios'
  import global from '../../../../api/config'
  import LocationTree from './LocationTree.vue'

  export default {
    components: {
      LocationTree,
    },
    data() {
      return {
        isImgNotes: false,
        imgUrl: 'http://static.patzn.com/imgNotes/img/noData.png',
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
          'margin-left': '215px'
        },
        isTree: true,
        pointList: [],
      }
    },
    mounted() {

    },
    methods: {
      _refresh() { //刷新
        this._classTree();
      },
      _open() {
        this.isImgNotes = true;
        this._classTree();
        this._tableHeight();
      },
      _tableHeight() {
        TableList = [];
        this.treeStyleObj.height = document.documentElement.clientHeight + 'px';
        this.$store.dispatch('LmsEquipInfo/list').then(() => {
          TableList = this.$store.state.LmsEquipInfo.list;
        });
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _locationData(id) {
        this._getPoint(id); //获取所有点位/图片
      },
      _getPoint(id) {
        locationId = id; //点位id;
        this.$store.dispatch('LmsEquipAudit/getPointImg', id).then(() => {
          var imgList = this.$store.state.LmsEquipAudit.imgObj;
          if(imgList.imagePath === undefined){
            this.$Message.warning('暂无图片，请先添加图片！');
            this.imgUrl = 'http://static.patzn.com/imgNotes/img/noData.png';
          }else{
            this.imgUrl = 'https://obs.myhwclouds.com/lims/' + imgList.imagePath;
            this.$store.dispatch('LmsEquipAudit/getPointInfo', id).then(() => {
              this.pointList = this.$store.state.LmsEquipAudit.pointList;
              $(".box").remove(); //清空canvas中的内容
              this._loadInit(this.pointList);
            });
          }
        });
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '20px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },
      _saveData() {
        setTimeout(() => {
          this.$store.dispatch('LmsEquipAudit/save', dataList).then(() => {
            if (this.$store.state.LmsEquipAudit.success) {
              this.$Message.success("数据保存成功！");
            }
          });
        }, 100)
      },
      _loadInit(point) {
        $(function () {
          //初始化计数器
          var num = 0;
          //区块锁定标识
          var lock = false;
          //加载layer拓展
          layer.config({
            extend: 'http://static.patzn.com/imgNotes/js/layer/extend/layer.ext.js'
          });
          //右键菜单参数
          context.init({
            fadeSpeed: 100,
            filter: function ($obj) {
            },
            above: 'auto',
            preventDoubleContext: true,
            compress: false
          });

          //
          function createBox(data) {
            var equipId = data.equipId;
            var dataId = data.id || '';
            var value = data.text || '';
            var color = data.color || '';
            var height = data.height || 0;
            var width = data.width || 0;
            var pageX = data.pageX || 0;
            var pageY = data.pageY || 0;
            //更新计数器并记录当前计数
            var curNum = num++;
            //创建区域块
            var pos = $("#canvas").position();
            var box = $(
              '<div class="box" rel="' + curNum + '" dataId="' + dataId + '" equipId=" ' + equipId + ' ">' +
              '<pre class="content">' + value + '</pre>' +
              '<div class="bg transparent" style="background-color:' + color + '"></div>' +
              '<div class="coor transparent"></div>' +
              '</div>').css({
              "width": width,
              "height": height,
              "top": pageY > 0 ? pageY + 'px' : (pos.top > 0 ? 0 : pos.top * -1 + 50),
              "left": pageX > 0 ? pageX + 'px' : (pos.left > 0 ? 0 : pos.left * -1 + 30)
            }).appendTo("#canvas");

            //计算文本位置
            box.find('.content').css({
              marginLeft: box.find('.content').width() / 2 * -1,
              marginTop: box.find('.content').height() / 2 * -1
            });
            //创建右键菜单
            context.attach('.box[rel=' + curNum + ']', [
              {header: '操作'},
              {
                text: '编辑区域', action: function (e) {
                  e.preventDefault();

                  layer.closeAll();
                  $("#removeTable").remove();
                  layer.open({
                    type: 1,
                    title: '编辑区域说明',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['800px', '600px'], //宽高
                    content: '<div id="removeTable">' +
                    '<div><input name="remark"  placeholder="请输入区域描述" id="remark" class="ivu-input" style="margin:10px 0" type="text"/>' +
                    '<input hidden id="equipId" name="equipId" type="text"/>' +
                    '</div>' +
                    '<div id="equipTable">'
                    + '</div>'
                    + '</div>',
                    btn: ['确定', '取消'],
                    yes: function (index, layero) {  //确定
                      var equipVal = $('input#equipId').val();
                      var textVal = $('input#remark').val();
                      var curCont = $('.box[rel=' + curNum + '] .content');
                      curCont.text(textVal).css({
                        marginLeft: curCont.width() / 2 * -1,
                        marginTop: curCont.height() / 2 * -1
                      });
                      $('.box[rel=' + curNum + ']').attr("equipId", equipVal);
                      layer.close(index);
                    },
                  });
                  var table = $("<table class='tableEquipClass'></table>");
                  var tr = '<thead><tr>' +
                    '<td style="width:80px">序号</td>' +
                    '<td style="width:200px">仪器名称</td>' +
                    '<td style="width:200px">仪器类别</td>' +
                    '<td style="width:300px">供应商名称</td>' +
                    '<td style="width:120px">规格型号</td>' +
                    '<td style="width:100px">品牌</td>' +
                    '<td style="width:100px">单价</td>' +
                    '<td style="width:200px">制造厂商</td>' +
                    '</tr></thead>';
                  $.each(TableList, function (i, v) {
                    tr += '<tbody><tr id=' + v.id + '>' +
                      '<td>' + (i + 1) + '</td>' +
                      '<td>' + (v.name===undefined?'':v.name) + '</td>' +
                      '<td>' + (v.className===undefined?'':v.className) + '</td>' +
                      '<td>' + (v.supplierName===undefined?'':v.supplierName) + '</td>' +
                      '<td>' + (v.spec===undefined?'':v.spec) + '</td>' +
                      '<td>' + (v.brand===undefined?'':v.brand)+ '</td>' +
                      '<td>' + (v.price===undefined?'':v.price) + '</td>' +
                      '<td>' + (v.productPlace===undefined?'':v.productPlace) + '</td>' +
                      '</tr></tbody>';
                  });
                  table.append(tr);
                  $("#equipTable").append(table);

                  $(".tableEquipClass td").click(function () {  //选中当前行的id
                    var id = $(this).parent().attr("id");
                    $("input#equipId").val(id);
                  });
                  var temptr = $();
                  $(".tableEquipClass").on("click", "tbody tr", function (event) {  //选中当前行改变颜色
                    temptr.removeClass("equipSelected");
                    temptr = $(this);
                    temptr.addClass("equipSelected")
                  });

                  $('input#remark').val($('.box[rel=' + curNum + '] .content').text()); //input回显

                }
              },
              {
                text: '更改尺寸', action: function (e) {
                  e.preventDefault();
                  layer.prompt({
                    title: '请输入区域尺寸（宽,高），最小值：30',
                    formType: 0,
                    value: $('.box[rel=' + curNum + ']').width() + "," + $('.box[rel=' + curNum + ']').height()
                  }, function (value, index, elem) {
                    var reg = /^[0-9]+,[0-9]+$/;
                    if (!reg.test(value)) {
                      alert('输入格式不正确，例：100,200');
                      return;
                    }
                    var size = value.split(',');
                    var box = $('.box[rel=' + curNum + ']');
                    box.css({
                      width: size[0] < 30 ? 30 : size[0],
                      height: size[1] < 30 ? 30 : size[1]
                    });
                    layer.close(index);
                  });
                }
              },
              {
                text: '删除区域', action: function (e) {
                  e.preventDefault();

                  var curBoxId = $('.box[rel=' + curNum + ']').attr("dataId"); //获取当前box的id
                  layer.confirm('确定要删除？', {
                    btn: ['确定', '取消'] //按钮
                  }, function () {
                    axios.delete(global.baseURL + '/slims/v1/equip_location_detail/?ids=' + curBoxId)
                      .then(function (data) {
                        if (data == true) {
                          $('.box[rel=' + curNum + ']').remove();
                          layer.closeAll();
                          layer.msg('请注意保存数据');
                        }
                      })
                  });

                }
              },
              {divider: true},
              {header: '更改颜色'},
              {
                text: '<font color="orange">橙色</font>', action: function (e) {
                  e.preventDefault();
                  $('.box[rel=' + curNum + '] .bg').css('background-color', '#ff9900');
                }
              },
              {
                text: '<font color="red">红色</font>', action: function (e) {
                  e.preventDefault();
                  $('.box[rel=' + curNum + '] .bg').css('background-color', '#ed3f14');
                }
              },
              {
                text: '<font color="blue">蓝色</font>', action: function (e) {
                  e.preventDefault();
                  $('.box[rel=' + curNum + '] .bg').css('background-color', '#2b85e4');
                }
              },
              {
                text: '<font color="green">绿色</font>', action: function (e) {
                  e.preventDefault();
                  $('.box[rel=' + curNum + '] .bg').css('background-color', '#19be6b');
                }
              },
              {
                text: '<font color="purple">紫色</font>', action: function (e) {
                  e.preventDefault();
                  $('.box[rel=' + curNum + '] .bg').css('background-color', 'purple');
                }
              },
            ]);
          }

          //添加区域
          $("#equip_info_point_add").click(function () {
            //弹出区域说明输入框
            layer.closeAll();
            $("#removeTable").remove();
            layer.open({
              type: 1,
              title: '添加区域说明',
              skin: 'layui-layer-rim', //加上边框
              area: ['800px', '600px'], //宽高
              content: '<div id="removeTable">' +
              '<div><input name="remark"  placeholder="请输入区域描述" id="remark" class="ivu-input" style="margin:10px 0" type="text"/>' +
              '<input hidden id="equipId" name="equipId" type="text"/>' +
              '</div>' +
              '<div id="equipTable">'
              + '</div>'
              + '</div>',
              btn: ['确定', '取消'],
              yes: function (index, layero) {  //确定
                var equipVal = $('input#equipId').val();
                var textVal = $('input#remark').val();
                createBox({
                  equipId: equipVal,
                  text: textVal,
                  width: 200,
                  height: 100
                });
                layer.close(index);
              },
            });
            var table = $("<table class='tableEquipClass'></table>");
            var tr = '<thead><tr>' +
              '<td style="width:80px">序号</td>' +
              '<td style="width:200px">仪器名称</td>' +
              '<td style="width:200px">仪器类别</td>' +
              '<td style="width:300px">供应商名称</td>' +
              '<td style="width:120px">规格型号</td>' +
              '<td style="width:100px">品牌</td>' +
              '<td style="width:100px">单价</td>' +
              '<td style="width:200px">制造厂商</td>' +
              '</tr></thead>';
            $.each(TableList, function (i, v) {
              tr += '<tbody><tr id=' + v.id + '>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + (v.name===undefined?'':v.name) + '</td>' +
                '<td>' + (v.className===undefined?'':v.className) + '</td>' +
                '<td>' + (v.supplierName===undefined?'':v.supplierName) + '</td>' +
                '<td>' + (v.spec===undefined?'':v.spec) + '</td>' +
                '<td>' + (v.brand===undefined?'':v.brand) + '</td>' +
                '<td>' + (v.price===undefined?'':v.price) + '</td>' +
                '<td>' + (v.productPlace===undefined?'':v.productPlace) + '</td>' +
                '</tr></tbody>';
            });
            table.append(tr);
            $("#equipTable").append(table);

            $(".tableEquipClass td").click(function () {  //选中当前行的id
              var id = $(this).parent().attr("id");
              $("input#equipId").val(id);
            });
            var temptr = $();
            $(".tableEquipClass").on("click", "tbody tr", function (event) {  //选中当前行改变颜色
              temptr.removeClass("equipSelected");
              temptr = $(this);
              temptr.addClass("equipSelected")
            });

          });
          //锁定区域
          $('#equip_info_point_lock').click(function () {
            if (lock) {
              $(this).text("锁定");
              lock = false;
              $('.box .coor').show();
            } else {
              $(this).text("解锁");
              lock = true;
              $('.box .coor').hide();
            }
          });
          //获取所有区块
          $('#equip_info_point_save').click(function () {
            var data = [];
            dataList = [];
            $('.box').each(function () {
              var box = {};
              box['equipId'] = $(this).attr('equipId');
              box['locationId'] = locationId;
              box['id'] = $(this).attr('dataId');
              box['text'] = $(this).find('.content').text();
              box['color'] = $(this).find('.bg').css('background-color');
              box['height'] = $(this).height();
              box['width'] = $(this).width();
              box['pageX'] = $(this).position().left;
              box['pageY'] = $(this).position().top;
              data.push(box);

            });
            dataList = data;
          });
          //创建拖拽方法
          $("#canvas").mousedown(function (e) {
            var canvas = $(this);
            e.preventDefault();
            var pos = $(this).position();
            this.posix = {'x': e.pageX - pos.left, 'y': e.pageY - pos.top};
            $.extend(document, {
              'move': true, 'move_target': this, 'call_down': function (e, posix) {
                canvas.css({
                  'cursor': 'move',
                  'top': e.pageY - posix.y,
                  'left': e.pageX - posix.x
                });
              }, 'call_up': function () {
                canvas.css('cursor', 'default');
              }
            });
          }).on('mousedown', '.box', function (e) {
            if (lock) return;
            var pos = $(this).position();
            this.posix = {'x': e.pageX - pos.left, 'y': e.pageY - pos.top};
            $.extend(document, {'move': true, 'move_target': this});
            e.stopPropagation();
          }).on('mousedown', '.box .coor', function (e) {
            var $box = $(this).parent();
            var posix = {
              'w': $box.width(),
              'h': $box.height(),
              'x': e.pageX,
              'y': e.pageY
            };
            $.extend(document, {
              'move': true, 'call_down': function (e) {
                $box.css({
                  'width': Math.max(30, e.pageX - posix.x + posix.w),
                  'height': Math.max(30, e.pageY - posix.y + posix.h)
                });
              }
            });
            e.stopPropagation();
          });
          //加载数据
          $.each(point, function (i, row) {
            createBox(row);
          });


        });
      },

    }
  }
</script>
