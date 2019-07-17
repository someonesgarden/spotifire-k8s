<template>

	<div class="IntroTyping">
		<div class="IntroTyping__body">
			<span class="IntroTyping__animated-text"  v-for="text in typingTexts" v-if="text.show" v-text="text.content"></span>
		</div>
	</div>

</template>

<script>
	export default{
		name: 'nowPlaying',
		data(){
			return {
				staticText: "",
                introTypingTexts: [
					"U ARE WALKIN",
					"IN A STORY.",
					"[EMORY]"
                ],
				currentText: 0
			}
		},

		computed: {
			typingTexts() {
				return this.introTypingTexts.map((text, index) => ({content: text, show: (index === this.currentText)}));
			},
			numberOfTexts() {
				return this.typingTexts.length - 1;
			}
		},

		mounted() {
			setInterval(() => {
				if( this.currentText === this.numberOfTexts ) {
					this.currentText = 0;
				} else {
					this.currentText ++;
				}
			}, 4000)
		}
	}
</script>

<style lang="scss" scoped>
	.IntroTyping{
		font-family: 'Allerta Stencil', sans-serif !important;

		position:absolute;
		top:0;
		left:0;
		width: 100%;
		height: 75%;
		display: flex;
		justify-content: center;
		align-items: center;

		&__body{
			height:30px;
			white-space: nowrap;
			-webkit-transition: all 0.5s ease-in-out;
			-moz-transition: all 0.5s ease-in-out;
			-ms-transition: all 0.5s ease-in-out;
			-o-transition: all 0.5s ease-in-out;
			transition: all 0.5s ease-in-out;
			color: white;
			display: flex;
			justify-content: center;
			white-space: nowrap;
		}

		&__animated-text{
			margin: 0 0 0 0.3em;
			padding: 0;
			font-weight: normal;
			font-size:1.8rem;
			overflow: hidden;
			display: inline-block;
			border-right: 0.1em solid;
			animation: typing 4s alternate, blink 0.5s infinite alternate;
			width: 0px;
			vertical-align: top;
			text-align: left;
			white-space: nowrap;

			@media all and (max-width: 767px) {
				font-size:1.8rem;
			}

			@media (min-width: 768px) and (max-width: 991px) {
				font-size:1.9rem;
			}
		}
	}


	@keyframes typing{
		from{
			width: 0;
		}
		35%{
			width: 100%;
		}
		65%{
			width: 100%;
		}
		to{
			width: 0px;
		}
	}

	@keyframes blink{
		50%{
			border-color: transparent;
		}
	}
</style>
