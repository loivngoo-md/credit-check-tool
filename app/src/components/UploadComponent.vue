<template>
  <div class="container">
    <div>
      <h2>Single File</h2>
      <hr />
      <label
        >File
        <input type="file" @change="handleFileUpload($event)" />
      </label>
      <br />
      <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    submitFile() {
      let formData = new FormData();
      formData.append('file', this.file);

      axios.post( '/single-file',
  formData,
  {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
  }
).then(function(){
  console.log('SUCCESS!!');
})
.catch(function(){
  console.log('FAILURE!!');
});
    },
    data() {
      return {
        file: "",
      };
    },
  },
};
</script>

<style></style>