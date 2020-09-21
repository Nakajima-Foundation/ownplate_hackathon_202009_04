<template>
	<div class="blogs">
		<h1>ブログ一覧ページ</h1>
		<div class="columns is-variable">
			<Blog />
			<Blog />
			<Blog />
		</div>
		<div class="columns is-variable">
			<Blog />
			<Blog />
			<Blog />
		</div>
		<div class="columns is-variable">
			<Blog />
			<Blog />
			<Blog />
		</div>
	</div>
</template>

<script>
import Blog from "~/components/Blog";

export default {
	components: {
		Blog,
	},
}
</script>

<style lang="css" scoped>
.blogs h1 {
	margin-top: 40px; 
}
</style>