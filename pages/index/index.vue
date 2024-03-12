<template>
	<view class="container">
		<view class="layout">
			<view class="box" v-for="(item,index) in pets" :key="item._id">
				<view class="pic">
					<image :src="item.url" mode="widthFix" lazy-load @click="onPreview(index)"></image>
				</view>
				<view class="text">{{item.content}}</view>
				<view class="author">—— {{item.author}}</view>
			</view>
		</view>
	</view>
</template>

<script setup>

const pets = ref([]);

//发送网络请求
function network(){
	uni.showLoading();
	uni.request({
		url:"https://tea.qingnian8.com/tools/petShow",
		data:{
			size: 10
		},
		header:{
			"access-key":"300584"
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
	network();
});
</script>

<style lang="scss" scoped>
.container{
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
}
</style>
