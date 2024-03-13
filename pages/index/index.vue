<template>
	<view class="container">
		<view class="menu">
			<uni-segmented-control :current="current" :values="values" @clickItem="onClickItem" 
				styleType="button" activeColor="#2B9939"></uni-segmented-control>
		</view>
		<view class="layout">
			<view class="box" v-for="(item,index) in pets" :key="item._id">
				<view class="pic">
					<image :src="item.url" mode="widthFix" lazy-load @click="onPreview(index)"></image>
				</view>
				<view class="text">{{item.content}}</view>
				<view class="author">—— {{item.author}}</view>
			</view>
		</view>
		
		<view class="float">
			<view class="item" @click="onRefresh">
				<uni-icons size="26" type="refreshempty" color="#888"></uni-icons>
			</view>
			<view class="item" @click="onTop">
				<uni-icons size="26" type="arrow-up" color="#888"></uni-icons>
			</view>
		</view>
		
		<view class="loadMore">
			<uni-load-more status="loading"></uni-load-more>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';

const pets = ref([]);
const current = ref(0);
const classify = [{key:"all",value:"全部"},{key:"dog",value:"狗狗"},{key:"cat",value:"猫猫"}];
const values = computed(()=> classify.map(item=>item.value));

//发送网络请求
function network(){
	uni.showLoading();
	uni.request({
		url:"https://tea.qingnian8.com/tools/petShow",
		data:{
			size: 5,
			type: classify[current.value].key
		},
		header:{
			"access-key":"108692"
		}
	}).then(res => {
		console.log(res);
		if(res.data.errCode == 0){
			pets.value = [...pets.value, ...res.data.data];
		}else if(res.data.errCode == 400){
			uni.showToast({
				title:res.data.errMsg,
				icon:"none"
			})
		}
		
	}).catch(e => {
		uni.showToast({
			title:"请求有误，请重新刷新",
			icon:"none"
		})
	}).finally(() => {
		uni.hideLoading();
		uni.stopPullDownRefresh();
	});
}

network();

//预览
function onPreview(index){
	let urls = pets.value.map(item => item.url);
	uni.previewImage({
		current: index,
		urls: urls
	})
}

//触底回调
onReachBottom(() => {
	console.log("触底了...");
	network();
});

//下拉刷新回调
onPullDownRefresh(() => {
	console.log("下拉刷新...");
	pets.value = [];
	current.value = 0;
	network();
});

function onRefresh(){
	console.log("刷新")
	uni.startPullDownRefresh()
}

function onTop(){
	console.log("顶部")
	uni.pageScrollTo({
		scrollTop: 0
	})
}

function onClickItem(e){
	console.log(e);
	pets.value = [];
	current.value = e.currentIndex;
	network();
}
</script>

<style lang="scss" scoped>
.container{
	.menu {
		padding: 50rpx 50rpx 0;
	}
	.layout{
		padding: 50rpx;
		.box{
			margin-bottom: 60rpx;
			box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
			border-radius: 15rpx;
			overflow: hidden;
			.pic{
				image{
					width: 100%;
				}
			}
			.text{
				padding: 30rpx;
				color: #333;
				font-size: 36rpx;
			}
			.author{
				padding: 0 30rpx 30rpx;
				text-align: right;
				font-size: 28rpx;
				color: #888;
			}
		}
	}
	.float {
		position: fixed;
		right: 30rpx;
		bottom: 80rpx;
		padding-bottom: env(safe-area-inset-bottom);
		.item {
			width: 90rpx;
			height: 90rpx;
			line-height: 90rpx;
			background-color: rgba(255, 255, 255, 0.9);
			border-radius: 50%;
			margin-bottom: 20rpx;
			text-align: center;
			border: 1px solid #eee;
		}
	}
	
	.loadMore{
		padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);
	}
}
</style>
