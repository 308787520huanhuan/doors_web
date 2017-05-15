<template>
  <div class="noAccessRight">
      <div class="noAccessRight-wrapper">
        <p>没有权限</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'noAccessRight',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.noAccessRight
{
  position:relative;
  width:100%;
  height:100%;
}
.noAccessRight-wrapper
{
    box-sizing: border-box;
    padding: 0 20px;
    top: 50%;
    position: absolute;
    width: 100%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
</style>
