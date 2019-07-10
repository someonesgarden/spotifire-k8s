<template>
  <footer class="footer"
    :class="{
      [`footer-${type}`]: type,
      [`footer-${size}`]: size
    }" :data-background-color="backgroundColor"
  >
    <template>
      <div class="container">
        <nav>
          <ul>
            <li>
              <a href="#">
                About Us
              </a>
            </li>

            <li>
              <a href="#">
                Licenses
              </a>
            </li>
          </ul>
        </nav>
        <div class="copyright">
          <a href="https://www.spotify.com/jp/" target="_blank">
            <img class="spotify_login_banner" src="/static/img/spotify/listen_on_spotify.jpg" alt="spotify_logo"/>
          </a>
        </div>
      </div>
    </template>

  </footer>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String,
    size: String
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  }
};
</script>
<style lang="scss">

  .container{
    ul{
      li{
        text-align:center;
        a{
          margin:0;
        }
      }
    }
  }
  .copyright {
    img.spotify_login_banner {
      margin: 0 auto;
      height: 28px;
      width: auto;
      border-radius: 4px;
    }
  }

</style>
