
const Storage = {
  state: {
    cachePage: [],
    pageTagsList: [],
    openedSubmenuArr: [], // 要展开的菜单数组
  },
  mutations: {
    setOpenedList(state) {
      if(JSON.parse(localStorage.tagPageList) !== undefined){
        state.pageTagsList = JSON.parse(localStorage.tagPageList);
      }else{
        state.pageTagsList = [];
      }
    },
    //清除所有的tag
    clearTag(state, tagObj) {
      state.pageTagsList = tagObj;
    },
    //新增tag
    createTag(state, tagObj) {
      if (state.pageTagsList.length === 0) { //list为空
        state.pageTagsList.push(tagObj);
        localStorage.tagPageList=JSON.stringify(state.pageTagsList);
      } else {
        let index = '';
        for (let i = 0; i < state.pageTagsList.length; i++) {
          if (tagObj.uri === state.pageTagsList[i].uri) {
            index = i;
          }
        }
        if (index === '') { //没有相同的tag
          state.pageTagsList.push(tagObj);
          localStorage.tagPageList=JSON.stringify(state.pageTagsList);
        }
      }

    },
    //关闭所有tag
    clearAllTags(state) {
      state.pageTagsList.splice(1);
      localStorage.tagPageList=JSON.stringify(state.pageTagsList);
    },
    //关闭其他tag
    clearOtherTags(state, vm) {
      let currentPath = vm.$route.path;
      let currentIndex = '';
      for (let i = 0; i < state.pageTagsList.length; i++) {
        if (currentPath === state.pageTagsList[i].uri) {
          currentIndex = i;
        }
      }

      if (currentIndex === 0) {
        state.pageTagsList.splice(1);
      } else {
        state.pageTagsList.splice(currentIndex + 1); //关闭当前页之后的tag
        state.pageTagsList.splice(1, currentIndex - 1); //关闭当前页之前的tag
      }
      localStorage.tagPageList=JSON.stringify(state.pageTagsList);
    },
    //关闭当前tag
    removeTag(state, name) {
      state.pageTagsList.map((item, index) => {
        if (item.uri === name) {
          state.pageTagsList.splice(index, 1);
        }
      });
    },

  }
};

export default Storage;
