<style lang="less">
  @import "../../pages/main.less";
</style>
<template>
  <div>
    <!--submenu-->
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}"
         v-if="isleftMenu">
      <shrinkable-menu
        @on-change="_handleSubmenuChange"
        :shrink="shrink"
        :theme="menuTheme"
        :active-name="activeName"
        :open-names="openedSubmenuArr"
        :menu-list="leftMenu">
        <div slot="top" class="logo-con" :class="classTheme">
          <!--<img v-show="!shrink" :src="imgUri" key="max-logo" alt="公司logo">-->
          <!--<img v-show="shrink" src="http://static.patzn.com/img/logo-min.png" key="min-logo"/>-->
        </div>
      </shrinkable-menu>
    </div>
    <!--submenu /-->
    <!--header-->
    <div class="main-header-con" :class="{'main-header-con-home-tags':isShowTags}"
         :style="{paddingLeft: shrink?'60px':isleftMenu?'200px':'0px'}">
      <div class="main-header" :class="classTheme">
        <div class="navicon-con">
          <div v-if="!isleftMenu" class="logo-img">
            <img src="http://static.patzn.com/img/logo-min.png">
          </div>
          <Button :style="{transform: 'rotateZ(' + (shrink ? '-90' : '0') + 'deg)'}" type="text"
                  @click="_toggleClick" v-if="isleftMenu">
            <Icon type="navicon" size="32" color="#eee"></Icon>
          </Button>

        </div>
        <div class="header-middle-con" style="padding-top:0;padding-bottom: 0">
          <!--menuList -->
          <ul class="navMenu">
            <li v-for="item in (isDropDown ? menuList.slice(0,6) : menuList)"
                :class="{'active':ishow===item.code}" :key="item.name">
              <a @click="_goto(item)">{{item.name}}</a>
            </li><!--菜单超过6个下拉隐藏-->
            <li style="width:50px;text-align: center" v-show="isDropDown">
              <Dropdown trigger="click">
                <a href="javascript:void(0)">
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="item in (isDropDown ? menuList.slice(6) : [])"
                                style="width:100%;line-height:40px" :key="item.name">
                    <a @click="_goto(item)" style="color: #333;">{{item.name}}</a>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <!--菜单超过5个下拉隐藏/-->
          </ul>
          <!--menuList /-->
        </div>
        <!--消息、皮肤、主题等-->
        <div class="header-avator-con">
          <TopBarMenu @on-result-change="_topBarChange" ref="tags"></TopBarMenu>
        </div>
        <!--消息、皮肤、主题等 /-->
        <!--多标签 -->
        <div class="tags-con" v-if="navTags">
          <tags-page-opened :pageTagsList="pageTagsList" @on-result-change="_pageListChange"></tags-page-opened>
        </div>
        <!--多标签 /-->
      </div>
    </div>
    <!--header /-->
  </div>
</template>

<script>
  import TopBarMenu from '../setting/TopBarMenu.vue';
  import tagsPageOpened from '../tags/tags-page-opened';
  import shrinkableMenu from '../shrinkable-menu/shrinkable-menu.vue';

  export default {
    components: {
      TopBarMenu,
      tagsPageOpened,
      shrinkableMenu
    },
    name: "header",
    props: {
      isShowTags: null,
      shrink: null,
      isleftMenu: null,
      menuList: null,
      ishow: null,
      pageTagsList: null,
      classTheme: null,
      navTags: null,
      menuTheme: null,
      activeName: null,
      openedSubmenuArr: null,
      leftMenu: null,
      imgUri: null,
    },
    data() {
      return {
        isDropDown: false
      }
    },
    updated() {
      this.$nextTick(() => {
        this._getDropDown();
      });
    },
    methods: {
      _goto(data) {
        if (this.ishow === data.code) {
          this.$router.push('/');
          this.$emit('on-result-change','back-current-home')
        } else {
          window.open(data.uri, '_blank')
        }
      },
      //判断导航显示的数量（最多显示6个）；
      _getDropDown() {
        if ($('.navMenu').width() - 200 < 750) {
          if (this.menuList.length > 6) {
            this.isDropDown = true;
          } else {
            this.isDropDown = false;
          }
        } else {
          this.isDropDown = false;
        }
      },
      //menu
      _handleSubmenuChange(msg) {
        this.$emit('on-result-change', 'left-sub-menu', msg);
      },
      _toggleClick() {
        this.$emit('on-result-change', 'toggle-click', '')
      },
      //message
      _topBarChange(msg) {
        this.$emit('on-result-change', 'top-bar-msg', msg);
      },
      //tags
      _openTags(data) {
        this.$refs.tags._closeTag(data);
      },
      _getMyAvatar() {
        this.$refs.tags._getMyAvatar();
      },
      _pageListChange(msg) {
        this.$emit('on-result-change', 'top-tags', msg)
      },
    },
  }
</script>
