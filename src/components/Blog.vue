<template>
	<div class="card">
		<router-link :to="`blogs/${blog.id}`">
			<div class="card-image">
				<figure class="image is-1by1">
					<img :src="blog.imageUrl" alt="Placeholder image">
				</figure>
			</div>
			<div class="card-content">
				<div class="media">
					<div>{{ blog.title }}</div>
				</div>
				<div class="content">
					<div class="blog-body">
						{{ blog.body }} 
					</div>
					<br>
					<time datetime="2011-11-18">
						{{ blog.createdAt.toDate() }}
					</time>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
import { db } from "~/plugins/firebase.js";

export default {
	props: [
		'blog',
	],
	data() {
		return {

		}
	},
}
</script>

<style lang="css" scoped>
.card {
	margin-top: 10px;
}
.card-image {
	padding: 10px;
}
.card-content {
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.media {
	color: black;
	font-weight: bold;
}
.blog-body {
	color: black;
}

</style>
