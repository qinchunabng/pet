"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const pets = common_vendor.ref([]);
    function network() {
      common_vendor.index.showLoading();
      common_vendor.index.request({
        url: "https://tea.qingnian8.com/tools/petShow",
        data: {
          size: 10
        },
        header: {
          "access-key": "300584"
        }
      }).then((res) => {
        console.log(res);
        if (res.data.errCode == 0) {
          pets.value = [...pets.value, ...res.data.data];
        } else if (res.data.errCode == 400) {
          common_vendor.index.showToast({
            title: res.data.errMsg,
            icon: "none"
          });
        }
      }).catch((e) => {
        common_vendor.index.showToast({
          title: "请求有误，请重新刷新",
          icon: "none"
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.stopPullDownRefresh();
      });
    }
    network();
    function onPreview(index) {
      let urls = pets.value.map((item) => item.url);
      common_vendor.index.previewImage({
        current: index,
        urls
      });
    }
    common_vendor.onReachBottom(() => {
      console.log("触底了...");
      network();
    });
    common_vendor.onPullDownRefresh(() => {
      console.log("下拉刷新...");
      pets.value = [];
      network();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(pets), (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.o(($event) => onPreview(index), item._id),
            c: common_vendor.t(item.content),
            d: common_vendor.t(item.author),
            e: item._id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Workspace/前端/uni-app/pet/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
