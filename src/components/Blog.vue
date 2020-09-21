<template>
	<div class="card">
		<router-link to="">
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
					{{ blog.body }} 
					<br>
					<time  datetime="20:00">
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
		'blog'
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
</style>
