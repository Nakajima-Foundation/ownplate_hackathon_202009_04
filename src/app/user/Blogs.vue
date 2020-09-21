<template>
	<div class="blogs">
		<h1>ブログ一覧ページ</h1>
		<div class="columns is-variable is-6">
			<Blog />
			<Blog />
			<Blog />
		</div>
		<div class="columns is-variable is-6">
			<Blog />
			<Blog />
			<Blog />
		</div>
		<div class="columns is-variable is-6">
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

</style>