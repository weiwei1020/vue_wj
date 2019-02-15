<!--<style lang="less">-->
  <!--@import '../../pages/main.less';-->
<!--</style>-->

<template>
  <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="tags-outer-scroll-con">
    <div class="close-all-tag-con">
      <Dropdown transfer @on-click="handleTagsOption">
        <Button size="small" type="primary">
          标签选项
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="clearAll">关闭所有</DropdownItem>
          <DropdownItem name="clearOthers">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <transition-group name="taglist-moving-animation">
        <Tag
          type="dot"
          v-for="(item, index) in pageTagsList"
          ref="tagsPageOpened"
          :key="item.name"
          :name="item.uri"
          @on-close="closePage"
          @click.native="linkTo(item)"
          :closable="item.id === undefined ? false : true"
          :color="item.uri === currentPath?'blue':'default'"
        >{{ itemTitle(item) }}
        </Tag>
      </transition-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tagsPageOpened',
    data() {
      return {
        currentPath: this.$route.path,
        tagBodyLeft: 0,
        refsTag: [],
        tagsCount: 1
      };
    },
    props: {
      pageTagsList: Array,
    },
    computed: {
    },
    methods: {
      itemTitle(item) {
        return item.name;
      },
      closePage(event, name) {

        let pageTagsList = this.$store.state.Storage.pageTagsList;
        let lastPageObj = pageTagsList[0];
        if (this.currentPath === name) {
          let len = pageTagsList.length;
          for (let i = 1; i < len; i++) {
            if (pageTagsList[i].uri === name) {
              if (i < (len - 1)) {
                lastPageObj = pageTagsList[i + 1];
              } else {
                lastPageObj = pageTagsList[i - 1];
              }
              break;
            }
          }
        }
        this.$store.commit('removeTag', name);
        pageTagsList = this.$store.state.Storage.pageTagsList;
        localStorage.tagPageList=JSON.stringify(pageTagsList);
        if (this.currentPath === name) {
          this.linkTo(lastPageObj);
        }

      },
      linkTo(item) {
        let obj = {
          openName: item.openName,
          activeName: item.name
        };
        this.$emit("on-result-change", obj);
        this.$router.push(item.uri);
      },
      handlescroll(e) { //鼠标滚轮事件
        var type = e.type;
        let delta = 0;
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
          delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;
        }
        let left = 0;
        if (delta > 0) {
          left = Math.min(0, this.tagBodyLeft + delta);
        } else {
          if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
            if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
              left = this.tagBodyLeft;
            } else {
              left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100);
            }
          } else {
            this.tagBodyLeft = 0;
          }
        }
        this.tagBodyLeft = left;
      },
      handleTagsOption(type) {
        if (type === 'clearAll') { //关闭所有
          let obj = {
            openName: '',
            activeName: this.$store.state.Storage.pageTagsList[0].name
          };
          this.$emit("on-result-change", obj);
          this.$store.commit('clearAllTags');
        } else { //关闭其他
          this.$store.commit('clearOtherTags', this);
        }
        this.tagBodyLeft = 0;
      },
      moveToView(tag) {
        if (tag.offsetLeft < -this.tagBodyLeft) {
          // 标签在可视区域左侧
          this.tagBodyLeft = -tag.offsetLeft + 10;
        } else if (tag.offsetLeft + 10 > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100) {
          // 标签在可视区域
          this.tagBodyLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth - tag.offsetLeft - 20);
        } else {
          // 标签在可视区域右侧
          this.tagBodyLeft = -(tag.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) + 20);
        }
      }

    },
    mounted() {
      this.refsTag = this.$refs.tagsPageOpened;
      setTimeout(() => {
        this.refsTag.forEach((item, index) => {
          if (this.$route.path === item.$route.path) {
            let tag = this.refsTag[index].$el;
            this.moveToView(tag);
          }
        });
      }, 1); // 这里不设定时器就会有偏移bug
    },
    watch: {
      '$route'(to) {
        this.currentPath = to.path;
        this.$nextTick(() => {
          this.refsTag.forEach((item, index) => {
            if (to.path === item.name) {
              let tag = this.refsTag[index].$el;
              this.moveToView(tag);
            }
          });
        });
      }
    }
  };
</script>
