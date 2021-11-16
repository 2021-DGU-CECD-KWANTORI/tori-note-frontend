<template lang="html">
  <section class="Review">
    <div style='position:absolute; top:90px; right:30px; z-index:1;'><b-button class="btn-fw btn-inverse-light" @click="exportToPDF"><i class="mdi mdi-download"></i>PDF</b-button></div>
    <div ref="pdfarea">
      <div class="row" style="height:100%; margin-top:40px;">
        <div id="torilogo" style="width:100%; display:none; text-align:center; margin-bottom:20px;">
          <img width="30%" height="100%" src="../../assets/images/tori-logo-blue.png">
        </div>
        <div class="col" style="height:100%;">
          <div class="nanumgothic" style="width:40%; height:100%; float:left; font-family: 'Nanum Gothic', sans-serif;">
            <h2>{{ lecture_name }} {{ date }}</h2>
          </div>
          <div style="width:60%; height:100%; float:right; margin-top:10px;">
            <span v-for="(key, idx) in keyword" v-bind:key="idx" style="float:right;">
              <b-button class="btn-fw btn-link btn-rounded">{{ key }}</b-button>&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 grid-margin">
          <div class="card" v-for="(item, index) in orderItems" v-bind:key="item.start" style="margin-bottom:25px;">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12 grid-margin">
                  <div calss="col">
                    <div class="col-md-5" style="float:left;">
                      <img width='100%' height='100%' v-bind:src='item.imgURL'>
                      <audio v-bind:id='index' controls="controls" src="[blobURL]" type="audio/mp3" name="playbar" style='width: 100%; margin-top:20px;' />
                      <div v-bind:id='index + 1000' @click="playAudio(index, item.id, item.start, item.end)" name="loadbtn" style='position:absolute; bottom:22px; left:31px; z-index:1; display:block'>▶</div>
                    </div>
                    <div class="col-md-7" style="float:right;">
                      <div style='position:absolute; top:0px; right:10px;'><b-button name="editSum" class="btn-fw btn-inverse-light" @click="editSummary(index)"><i class="mdi mdi-border-color"></i>Save</b-button></div>
                      <h4 class='card-title mb-0' id="Pscript">Summary</h4><br/>
                      <div id="summary" class="editable scroll type1" contenteditable="true" style='width:100%; border:none;'>
                        <div v-if="item.summary[0] === 'NO SUMMARY'" style="text-align:center;">
                          <img width='50%' height='100%' src='../../assets/images/kwantori.gif'>
                          <br/>요약을 생성 중이에요!
                        </div>
                        <div v-else> <!-- 요약이 있는 경우 -->
                          <ol>
                            <li><div name='summary'>{{item.summary[0]}}</div></li>
                            <li><div name='summary'>{{item.summary[1]}}</div></li>
                            <li><div name='summary'>{{item.summary[2]}}</div></li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div style='position:absolute; top:0px; right:10px;'><b-button name="editScr" class="btn-fw btn-inverse-light" @click="editScript(index)"><i class="mdi mdi-border-color"></i>Save</b-button></div>
                  <h4 class='card-title mb-0' id="Pscript">Script</h4><br/>
                  <textarea v-model="item.script" id="script" name="script" class='scroll type1' style='height:180px; width:100%; border:none;'>
                  </textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import html2pdf from 'html2pdf.js'
import S3config from '../Key.js'
import axios from 'axios'

export default {
  name: 'Review',
  data () {
    return {
      items: [
      ],
      request: false, // storage 한번만 요청
      mp3Arr: null,
      global_id: {}
    }
  },
  props: {
    lecture_name: { type: String, default: '' },
    date: { type: String, default: '' },
    keyword: { type: [String], default: '' }
  },
  computed: {
    orderItems: function () {
      if (this.request === false) {
        this.RequestItem()
        console.log(this.items)
      }
      return this.items.slice().sort(function (a, b) {
        return a.start - b.start // start 기준으로 오름차순 정렬
      })
    }
  },
  methods: {
    RequestItem () {
      axios.get('http://localhost:3000/storage/note', {
        params: {
          lecture_name: this.lecture_name,
          date: this.date
        }
      })
        .then(function (data) {
          for (var i = 0; i < data.data.length - 1; i++) {
            console.log(data.data[i])
            this.global_id = data.data[i].id
            this.items.push({
              imgURL: data.data[i].imgURL + ',' + data.data[i].image,
              id: data.data[i].id,
              start: data.data[i].start,
              end: data.data[i].end,
              script: data.data[i].script,
              summary: data.data[i].summary
            })
          }
          console.log(this.items.length)
          this.request = true
        }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    setTimeoutPromise (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
      })
    },
    async exportToPDF () {
      console.log('pdf 생성 시작')
      const textarea = document.getElementsByTagName('textarea')
      for (let i = 0; i < textarea.length; i++) {
        textarea[i].style.height = '1px'
        textarea[i].style.height = (2 * textarea[i].scrollHeight) + 'px' // textarea 높이 조절 (스크롤 없도록)
      }
      const editSum = document.getElementsByName('editSum')
      const editScr = document.getElementsByName('editScr')
      const loadbtn = document.getElementsByName('loadbtn')
      for (let i = 0; i < editSum.length; i++) {
        editSum[i].style.display = 'none'
        editScr[i].style.display = 'none'
        loadbtn[i].style.display = 'none'
      }

      const logodiv = document.getElementById('torilogo')
      logodiv.style.display = 'block'

      html2pdf(this.$refs.pdfarea, {
        margin: 0,
        filename: this.lecture_name + '_' + this.date + '.pdf',
        image: {type: 'jpg', quality: 0.95},
        html2canvas: {
          useCORS: true, scrollY: 0, scale: 1, dpi: 300, letterRendering: true, allowTaint: false
        },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true }
      })

      await this.setTimeoutPromise(5000)
      for (let i = 0; i < textarea.length; i++) {
        textarea[i].style.height = '180px'
      }
      for (let i = 0; i < editSum.length; i++) {
        editSum[i].style.display = 'block'
        editScr[i].style.display = 'block'
        loadbtn[i].style.display = 'block'
      }
      logodiv.style.display = 'none'
    },
    loadAudio (S3, params) {
      return new Promise((resolve, reject) => {
        S3.getObject(params, (err, data) => {
          if (err) {
            console.log(err, err.stack)
          } else if (this.mp3Arr === null) {
            this.mp3Arr = data.Body
            resolve()
          } else {
            this.mp3Arr = new Uint8Array([...this.mp3Arr, ...data.Body])
            resolve()
          }
        })
      })
    },
    async playAudio (index, id, start, end) {
      document.getElementById(index + 1000).style.display = 'none'
      const AWS = require('aws-sdk')
      const S3 = new AWS.S3({
        endpoint: new AWS.Endpoint('https://kr.object.ncloudstorage.com'),
        region: 'kr-standard',
        credentials: {
          accessKeyId: S3config.accessKeyId,
          secretAccessKey: S3config.secretAccessKey
        }
      })
      for (var i = Number(start); i <= Number(end); i++) {
        console.log(i)
        const params = {
          Bucket: S3config.Bucket,
          Key: String(id) + String(i) + '.mp3'
        }
        await this.loadAudio(S3, params)
      }
      let mp3Blob = new Blob([this.mp3Arr], {type: 'audio/mp3'})
      this.mp3Arr = null
      document.getElementById(index).src = window.URL.createObjectURL(mp3Blob)
      document.getElementById(index).play()
    },
    editSummary (index) {
      const summary0 = document.getElementsByName('summary')[index * 3].innerText
      const summary1 = document.getElementsByName('summary')[index * 3 + 1].innerText
      const summary2 = document.getElementsByName('summary')[index * 3 + 2].innerText
      this.items[index].summary[0] = summary0
      this.items[index].summary[1] = summary1
      this.items[index].summary[2] = summary2
    },
    editScript (index) {
      const edit = document.getElementsByName('script')[index].value
      this.items[index].script = edit
    }
  }
}
</script>

<style scoped lang="scss">
.scroll{ overflow-y: scroll; }
.type1::-webkit-scrollbar{ width: 6px; }
.type1::-webkit-scrollbar-thumb{ height: 7%; background-color: rgb(223, 223, 223); border-radius: 15px; }
.type1::-webkit-scrollbar-track{ background-color: white; }

textarea { resize: none; }

.bounce {
  animation: bounce_frames 0.5s;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
  animation-iteration-count: 1000;
}
@keyframes bounce_frames {
  from {transform: translate3d(0, 0, 0);}
  to {transform: translate3d(0, -20px, 0);}
}

.nanumgothic * {
 font-family: 'Nanum Gothic', sans-serif;
 font-weight: 600;
}
</style>
