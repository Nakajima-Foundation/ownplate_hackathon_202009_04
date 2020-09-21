<template>
	<div class="blogs">
		<h1>ブログ一覧ページ</h1>
		<div class="columns is-multiline">
			<ul v-for="(blog, index) in blogs" :key="index" class="column is-3 blog-card">
				<Blog 
				:blog="blog" 
				/>
			</ul>
		</div>
	</div>
</template>

<script>
import { db } from "~/plugins/firebase.js";
import Blog from "~/components/Blog";

export default {
	components: {
		Blog,
	},
	data() {
		return {
			blogs: [],
		}
	},
	mounted() {
    	const restaurantId = this.$route.params.restaurantId
		db.collection(`restaurants/${restaurantId}/blogs`).get().then((ref) => {
			ref.forEach((doc) => {
				if (!doc.exists) {
					console.log('No such document!');
				} else {
					this.blogs.push({id: doc.id, ...doc.data()})
				}
			})
		}).catch(err => {
			console.log('Error getting document', err);
		});
	},
}
</script>

<style lang="css" scoped>
.blog-card {
	margin: 30px;
}
.blogs h1 {
	margin-top: 40px; 
}
</style>