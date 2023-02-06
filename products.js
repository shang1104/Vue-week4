import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

import pagination from "./pagination.js";

const site = `https://vue3-course-api.hexschool.io/v2/`;
const path = `shangway`;

let productModal = null;
let delProductModal = null;
const app = createApp({
  data() {
    return {
      // site: `https://vue3-course-api.hexschool.io/v2/`,
      // path: `shangway`,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 新增或是編輯使用
      page: {},
    };
  },
  methods: {
    //預設參數值
    getProducts(page = 1) {
      // const url = `https://vue3-course-api.hexschool.io/v2/api/shangway/admin/products/all`;
      const url = `${site}api/${path}/admin/products/?page=${page}`;
      axios.get(url).then((res) => {
        this.products = res.data.products;
        this.page = res.data.pagination;
        console.log(res.data);
      });
    },
    openModal(status, product) {
      // console.log(product);
      if (status === "create") {
        productModal.show();
        console.log(product);
        this.isNew = true;
        //帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        productModal.show();
        console.log(product);
        this.isNew = false;
        this.tempProduct = { ...product };
        //帶入當前要編輯的資料
      } else if (status === "delete") {
        delProductModal.show();
        console.log(`delete`);
        this.tempProduct = { ...product }; //等等取 id使用
      }
    },
    updateProduct() {
      let url = `${site}api/${path}/admin/product`;
      //用this.isNew 判斷 API 要怎麼運行
      let method = "post";
      if (!this.isNew) {
        url = `${site}api/${path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }

      axios[method](url, { data: this.tempProduct }).then((res) => {
        console.log(res);
        this.getProducts();
        productModal.hide(); //關閉Model
      });
    },
    deleteProduct() {
      const url = `${site}api/${path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then(() => {
        this.getProducts();
        delProductModal.hide(); //關閉Model
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  components: {
    pagination,
  },
  mounted() {
    //axios headers
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    axios.defaults.headers.common["Authorization"] = cookieValue;
    this.getProducts();

    productModal = new bootstrap.Modal("#productModal");
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
});
app.component("product-modal", {
  props: ["tempProduct", "updateProduct"],
  template: `#product-modal-template`,
});

app.mount("#app");
