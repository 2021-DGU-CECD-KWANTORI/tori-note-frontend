<template lang='html'>
  <section class='Study'>
    <div class='row'>
      <div id="popPosition" class="popPosition card">
        <p>Tori Note가 여러분의 학습력을 높여줄게요!</p>
        <textarea id="title" rows='1' style='width:98%; margin-bottom:15px' placeholder="Input your Note Title..."></textarea><br/>
        <b-button class="btn-fw btn-inverse-light" @click="AllrecordPer10s"><i class="mdi mdi-note-plus"></i>Create</b-button>
      </div>
      <!--<b-button class="btn-fw btn-inverse-light" @click="test" style="display:none">test</b-button>-->
      <div style='position:relative; top:3px; left:3px; padding:2px;'><img v-on:click="Time_Line=!Time_Line" id="toggle" width='18px' height='18px' src="../assets/images/arrow_r.png"></div>
      <div v-show="Time_Line" class='col-md-1 grid-margin stretch-card timelineDiv' id='timeline'>
        <div class='card'>
          <div class='card-body d-flex flex-column' style='padding-top:5%; padding-left:4%; padding-right:0%;'>
            <div class='col scroll type1'>
              <div v-for="(item, index) of timeline" v-bind:key='item' class='card1' style='border: solid 1px rgb(255, 255, 255);'>
                <div class='card-body' style='padding:0px;'>
                  <div class='row'>
                  <img width='100%' height='100%' v-bind:src='item.imgURL' @click="imgClicked(item.imgURL, index)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='col grid-margin stretch-card'>
        <div class='card'>
          <div class='card-body'>
            <h4 class='card-title mb-0'>Video</h4>
            <div v-if="Record" style='position:absolute; top:25px; right:160px;'><b-button class="btn-fw btn-inverse-light" @click="StopPer10s"><i class="mdi mdi-stop"></i>Stop</b-button></div>
            <div v-else style='position:absolute; top:25px; right:160px;'><b-button class="btn-fw btn-inverse-light" @click="ShowPopTitle"><i class="mdi mdi-step-forward"></i>Start</b-button></div>
            <div style='position:absolute; top:25px; right:25px;'><b-button class="btn-fw btn-inverse-light" @click="ShareScreen"><i class="mdi mdi-desktop-mac"></i>Share</b-button></div><br/>
            <video ref="videoElement" controls autoplay></video><br/>
            <canvas></canvas>
          </div>
        </div>
      </div>
      <div class='col-md-5 grid-margin stretch-card'>
        <div class='card'>
          <div class='card-body'>
            <h4 class='card-title mb-0' id='script'>Script</h4><br/>
            <div style='position:absolute; top:25px; right:25px;'><b-button class="btn-fw btn-inverse-light" @click="editScript"><i class="mdi mdi-border-color"></i>Edit</b-button></div>
            <div class='col' style='padding-left:0px; padding-right:0px;'>
              <img id="scriptIMG" width='100%' src="" style='margin-right:2%;'>
              <textarea id="script" class='scroll type1' rows='5' style='width:100%; border:none;'></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import JQuery from 'jquery'

let $ = JQuery

export default {
  name: 'dashboard',
  data () {
    return {
      timeline: [],
      StopPer10: false, // true면 녹화 중지
      Record: false, // true면 녹화 시작
      Time_Line: true, // 이건 걍 타임라인 토글 역할
      localStream: {},
      mediaRecorder: {},
      chunks: [],
      mediaRecorder_Even: {},
      chunks_Even: [],
      sending_index: {}, // 파일 이름에 인덱스
      Title: {}, // 사용자가 입력한 강의 제목
      fileID: {}, // 현재 강의의 파일명
      curDate: {}, // 사용자가 강의 제목 입력했을 때의 시간
      imgIndex: {} // 사용자가 조회, 수정하고자 하는 스크립트의 슬라이드 번호
    }
  },
  methods: {
    toggleProBanner: function () {
      $('body').toggleClass('pro-banner-collapse')
    },
    ShareScreen () {
      this.sending_index = 0
      if (navigator.mediaDevices.getDisplayMedia && window.MediaRecorder !== undefined) {
        navigator.mediaDevices.getDisplayMedia({video: true, audio: true}).then(function (screenStream) {
          this.localstream = screenStream
          this.localstream.getTracks().forEach(function (track) {})
          document.querySelector('video').srcObject = this.localstream
          document.querySelector('video').play()
          document.querySelector('video').muted = true
          try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            window.audioContext = new AudioContext()
          } catch (e) {
          }
        }.bind(this))
      }
    },
    setTimeoutPromise (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
      })
    },
    // test () {
    // this.timeline.push({imgURL: 'https://img.insight.co.kr/static/2016/02/15/700/yy1275us791rlld79jxb.jpg', id: 'temp'})
    // },
    RequestImg () {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/timeline/images',
        data: {
          'id': String(this.fileID)
        },
        dataType: 'json',
        async: false,
        success: function (data) {
          // this.timeline.push({imgURL: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAABWoAAAM...', id: 'temp'})
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            this.timeline.push({imgURL: data[i].imgURL + ',' + data[i].image, id: data[i].id})
          }
        }.bind(this)
      }).catch(error => {
        console.log(error.message)
      })
    },
    imgClicked (imgURL, index) {
      const scriptIMG = document.getElementById('scriptIMG')
      scriptIMG.src = imgURL

      this.imgIndex = index
      console.log(index)
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/script/slide',
        data: {
          'lecture_name': this.Title,
          'date': this.curDate,
          'id': this.fileID + '_' + this.imgIndex,
          'start': this.imgIndex
        },
        dataType: 'json',
        success: function (data) {
          var textarea = document.querySelector('textarea#script')
          textarea.value = data
        }
      }).catch(error => {
        console.log(error.message)
      })
    },
    editScript () {
      var textarea = document.querySelector('textarea#script')
      var editScript = textarea.value
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/script/modify',
        data: {
          'lecture_name': this.Title,
          'date': this.curDate,
          'id': this.fileID + '_' + this.imgIndex,
          'start': this.imgIndex,
          'content': editScript
        },
        dataType: 'json'
      }).catch(error => {
        console.log(error.message)
      })
    },
    BtnRecordClicked () {
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        var options = {
          bitsPerSecond: 80000,
          mimeType: 'video/webm;codecs=opus' }
        this.mediaRecorder = new MediaRecorder(this.localstream, options)
      } else {
        this.mediaRecorder = new MediaRecorder(this.localstream)
      }
      this.mediaRecorder.start(10)
      this.mediaRecorder.ondataavailable = function (e) {
        this.chunks.push(e.data)
      }.bind(this)
    },
    BtnStopClicked () { // CaptureScreen이랑 합쳐
      this.mediaRecorder.stop()
      return new Promise((resolve, reject) => {
        this.mediaRecorder.onstop = async function () {
          const video = document.querySelector('video') // 여기부터
          const canvas = window.canvas = document.querySelector('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          const imgBase64 = canvas.toDataURL('image/jpeg', 'image/octet-stream')
          const decodImg = atob(imgBase64.split(',')[1])
          let array = []
          for (let i = 0; i < decodImg.length; i++) {
            array.push(decodImg.charCodeAt(i))
          }
          const image = new Blob([new Uint8Array(array)], {type: 'image/png'})
          const ImagefileName = this.fileID + '_' + this.sending_index + '.png' // 여기까지 스크린샷

          const audio = new Blob(this.chunks, {type: 'video/webm'})
          const AudiofileName = this.fileID + '_' + this.sending_index++ + '.webm'
          this.chunks = []

          let formData = new FormData()
          formData.append('upload', image, ImagefileName)
          formData.append('lecture_name', this.Title)
          formData.append('date', this.curDate)
          formData.append('upload', audio, AudiofileName)

          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/stream',
            cache: false,
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false
          }).catch(error => {
            console.log(error.message)
          })
          resolve()
        }.bind(this)
      })
    },
    BtnRecordClicked_Even () {
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        var options = {
          bitsPerSecond: 80000,
          mimeType: 'video/webm;codecs=opus' }
        this.mediaRecorder_Even = new MediaRecorder(this.localstream, options)
      } else {
        this.mediaRecorder_Even = new MediaRecorder(this.localstream)
      }
      this.mediaRecorder_Even.start(10)
      this.mediaRecorder_Even.ondataavailable = function (e) {
        this.chunks_Even.push(e.data)
      }.bind(this)
    },
    BtnStopClicked_Even () { // CaptureScreen이랑 합쳐
      this.mediaRecorder_Even.stop()
      return new Promise((resolve, reject) => {
        this.mediaRecorder_Even.onstop = async function () {
          const video = document.querySelector('video') // 여기부터
          const canvas = window.canvas = document.querySelector('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
          const imgBase64 = canvas.toDataURL('image/jpeg', 'image/octet-stream')
          const decodImg = atob(imgBase64.split(',')[1])
          let array = []
          for (let i = 0; i < decodImg.length; i++) {
            array.push(decodImg.charCodeAt(i))
          }
          const image = new Blob([new Uint8Array(array)], {type: 'image/png'})
          const ImagefileName = this.fileID + '_' + this.sending_index + '.png' // 여기까지 스크린샷

          const audio = new Blob(this.chunks_Even, {type: 'video/webm'})
          const AudiofileName = this.fileID + '_' + this.sending_index++ + '.webm'
          this.chunks_Even = []

          let formData = new FormData()
          formData.append('upload', image, ImagefileName)
          formData.append('lecture_name', this.Title)
          formData.append('date', this.curDate)
          formData.append('upload', audio, AudiofileName)

          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/stream',
            cache: false,
            enctype: 'multipart/form-data',
            data: formData,
            processData: false,
            contentType: false
          }).catch(error => {
            console.log(error.message)
          })
          resolve()
        }.bind(this)
      })
    },
    async OddrecordPer10s () {
      this.BtnRecordClicked()
      await this.setTimeoutPromise(59000)
      await this.BtnStopClicked()
      this.RequestImg()
    },
    async EvenrecordPer10s () {
      this.BtnRecordClicked_Even()
      await this.setTimeoutPromise(59000)
      await this.BtnStopClicked_Even()
      this.RequestImg()
    },
    async AllrecordPer10s () {
      const pop = document.getElementById('popPosition')
      pop.style.display = 'none'

      var textarea = document.querySelector('textarea#title')
      this.Title = textarea.value

      var now = new Date()
      this.curDate = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate()

      this.fileID = Math.floor(Math.random() * 10000000)

      if (this.Title === '') {
        alert('제목을 입력하세요!')
      } else {
        this.Record = true
        this.StopPer10 = false
        while (this.StopPer10 === false) {
          this.OddrecordPer10s()
          await this.setTimeoutPromise(58770)
          this.EvenrecordPer10s()
          await this.setTimeoutPromise(58770)
        }
      }
    },
    async StopPer10s () {
      this.Record = false
      this.StopPer10 = true
      await this.BtnStopClicked()
      await this.BtnStopClicked_Even()
      this.CaptureScreen()
    },
    ShowPopTitle () {
      const pop = document.getElementById('popPosition')
      pop.style.display = 'block'
    }
  }
}
</script>

<style scoped lang='scss'>
.scroll{ overflow-y: scroll; }
.type1::-webkit-scrollbar{ width: 6px; }
.type1::-webkit-scrollbar-thumb{ height: 7%; background-color: rgb(223, 223, 223); border-radius: 15px; }
.type1::-webkit-scrollbar-track{ background-color: white; }
.card1 {
    border: solid 1px rgb(223, 223, 223); margin-bottom: 5px;
    .card1-title { color: black; }
    .card1-header { background: black; }
}
.left-box { width:55%; height:90%; float:left; box-sizing:border-box; }
.right-box { width:45%; height:90%; float:right; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; text-align:left; }
video { background:#222; width:100%; height:380px; }
canvas { display:none; visibility:hidden; }
#popPosition {padding:3%; text-align:center; background-color:#fff; border:solid 1px rgb(223, 223, 223); border-radius:10px 10px 10px 10px; position:absolute; height:210px; width:400px; margin:-105px 0px 0px -200px; top:50%; left:50%; z-index:1; display:none;}
</style>
