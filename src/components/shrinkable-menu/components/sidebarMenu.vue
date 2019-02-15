<style lang="less">
  @import '../styles/menu.less';
</style>

<template>
  <Menu ref="sideMenu" :active-name="activeName" :open-names="openNames" :theme="menuTheme" width="auto" accordion>
    <template v-for="item in menuList.leftMenus">
      <!--有子菜单-->
      <div v-if="item.subMenus.length!==0">
        <Submenu :name="item.name" :key="item.name">
          <template slot="title">
            <Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ item.name }}</span>
          </template>
          <template v-for="child in item.subMenus">
            <MenuItem :name="child.name" :key="'menuitem' + child.name"
                      @click.native="_goto(child.uri);_acitveMenu(item.name,child.name);_changeMenu(item.name,child,menuList,'')">
              <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
              <span class="layout-text" :key="'title' + child.name">{{ child.name}}</span>
            </MenuItem>
          </template>
        </Submenu>
      </div>
      <!--没有子菜单-->
      <div v-else>
        <MenuItem :name="item.name" :key="'menuitem' + item.name"
                  @click.native="_goto(item.uri);_acitveMenu(item.name,'');_changeMenu(item.name,'',menuList,item.uri)">
          <Icon :type="item.icon" :size="iconSize" :key="'icon' + item.name"></Icon>
          <span class="layout-text" :key="'title' + item.name">{{ item.name}}</span>
        </MenuItem>
      </div>
    </template>
  </Menu>
</template>

<script>
  import Store from 'store2';

  export default {
    name: 'sidebarMenu',
    props: {
      menuList: Array,
      iconSize: Number,
      menuTheme: {
        type: String,
        default: 'dark'
      },
      openNames: {
        type: Array
      },
      activeName: ''
    },
    methods: {
      _goto(next) {
        this.$router.push(next)
      },
      _acitveMenu(openName, activeName) {
        let activeMenus = {};
        if (activeName === '') {
          activeMenus = {openName: openName};
        } else {
          activeMenus = {openName: openName, activeName: activeName};
        }
        localStorage.setItem("activeMenus", JSON.stringify(activeMenus));//用localStorage保存转化好的的字符串
      },
      _changeMenu(name, child, item, uri) {
        if (child === '') {
          this.$emit("on-change", {openName: name, name: name, uri: uri});
          Store.session('crumbsArray', [item.name, name]);
        } else {
          child.openName = name;
          this.$emit("on-change", child);
          //存储 面包屑数组
          let data = [item.name, name, child.name];
          Store.session('crumbsArray', data);
        }
      },
    },
    updated() {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
          this.$refs.sideMenu.updateActiveName();
        }
      });
    }

  };
</script>
