<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡牌视图 -->
    <el-card>
      <!-- 添加商品分类 -->
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddGoodPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 商品展示 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="60px"
        ></el-table-column>
        <el-table-column label="添加时间" width="100px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取商品列表成功");
      console.log(res);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    goAddGoodPage() {
        this.$router.push('/goods/add')
    },
    showEditGoodsDialog() {},
    async delGoodsDialog(row) {
      const confirmRes = await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((error) => error);
      console.log(confirmRes)
      if(confirmRes !== 'confirm') {
          return this.$message.error('已取消删除!')
      }
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      console.log(res)
      if(res.meta.status !== 200 ){
          return this.$message.error('删除商品失败!')
      }
      this.$message.success('删除商品成功!')
      this.getGoodsList()
    },
  },
};
</script>

<style lang="less" scoped></style>
