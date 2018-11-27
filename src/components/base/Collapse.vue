<template>
  <div>
    <Row :gutter="16">
      <!--待选列表-->
      <Col :span="leftSpan">
      <div v-if="isFold">
        <Card v-if="hideCheck==undefined">
          <div slot="title" style="position: relative" >
            <div>{{leftTitle}}</div>
            <div style="position: absolute;right: -14px;top:-14px;">
              <Tooltip content="收起" placement="bottom">
                <div style="padding: 14px" @click="_fold">
                  <Icon type="arrow-left-b"></Icon>
                </div>
              </Tooltip>
            </div>
          </div>
          <div>
            <slot name="left"></slot>
          </div>
        </Card>
        <div v-if="hideCheck!=undefined">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="hide-box" v-else>
        <Tooltip content="打开" placement="bottom">
          <div @click="_fold" style="margin:-14px;padding: 14px">
            <Icon type="arrow-right-b"></Icon>
          </div>
        </Tooltip>
        <div>{{leftTitle}}</div>
      </div>
      </Col>
      <!--操作按钮-->
      <Col span="1">
      <div :style="hideCheck==undefined?'margin-top:160px':'margin:160px 0 0 -12px'">
        <Tooltip content="添加" placement="right">
          <Button type="primary" @click="_options('添加')">
            <Icon type="chevron-right"></Icon>
          </Button>
        </Tooltip>
      </div>
      <div :style="hideCheck==undefined?'margin-top:20px':'margin:20px 0 0 -12px'">
        <Tooltip content="删除" placement="right">
          <Button type="primary" @click="_options('删除')">
            <Icon type="chevron-left"></Icon>
          </Button>
        </Tooltip>
      </div>
      </Col>
      <!--已选列表-->
      <Col :span="rightSpan">
      <Card v-if="hideCheck==undefined">
        <div slot="title" style="position: relative">
          <div>{{rightTitle}}</div>
        </div>
        <div>
          <slot name="right"></slot>
        </div>
      </Card>
        <div  v-if="hideCheck!=undefined">
          <slot name="right"></slot>
        </div>
      </Col>
    </Row>
  </div>
</template>
<style scoped>
  .hide-box {
    width: 43px;
    height: 431px;
    padding: 14px;
    text-align: center;
    border: 1px solid #e9eaec;
    border-radius: 4px
  }
</style>
<script>
  export default {
    name: "collapse",
    props: {
      leftTitle: null,
      rightTitle: null,
      hideCheck:null,

      showModal: false
    },
    data() {
      return {
        // leftSpan: 1,
        // rightSpan: 22,
        // isFold: false,

        leftSpan: 11,
        rightSpan: 12,
        isFold: true,
      }
    },
    methods: {
      _fold() {
        if (this.isFold) {
          this.leftSpan = 1;
          this.rightSpan = 22;
          this.isFold = false;
        } else {
          this.leftSpan = 11;
          this.rightSpan = 12;
          this.isFold = true;
        }
      },
      _options(name) {
        this.$emit('on-result-change', name);
      }
    }
  }
</script>

<style scoped>

</style>
