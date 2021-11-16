<template lang="html">
  <section class="myPdfFiles">
    <div class="row">
      <div v-for="(date, idx) of sortUniqueDate" :key="idx">
        <div calss="row">
          <div>
            <h3>{{ date.substring(0, 4) }}.{{ date.substring(4, 6) }}.{{ date.substring(6, 8) }}.</h3>
          </div>
          <div class='grid-margin stretch-card row'>
            <div class='col-md-3 grid-margin stretch-card' v-for="item of items" v-bind:key="item.lecture_name" v-if="date==item.date">
              <div class='zoom card nanumgothic' @click="showReview(item.lecture_name, item.date, item.keyword)">
                <div class='card-body' style="padding:0;">
                  <img style="margin-bottom:15px;" width='100%' height='60%' v-bind:src='item.image'>
                  <div style="padding-left:15px; padding-right:15px; padding-bottom:5px;">
                    <div style="text-align:center;"><h4>{{ item.lecture_name }}</h4></div>
                    {{ item.date.substring(0, 4) }}.{{ item.date.substring(4, 6) }}.{{ item.date.substring(6, 8) }}.<br/>
                    <span v-for="(keyword, idx) in item.keyword" v-bind:key="idx">
                      <span v-if="idx < 3">#{{ keyword }}&nbsp; </span>
                      <span v-else></span>
                    </span>
                  </div>
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
import JQuery from 'jquery'

let $ = JQuery

export default {
  name: 'MyStorage',
  data () {
    return {
      items: [
      ],
      tempUnique: [], // 요소 중복 제거
      request: false // storage 한번만 요청
    }
  },
  computed: {
    orderItems: function () {
      if (this.request === false) {
        this.RequestItem()
      }
      return this.items.slice().sort(function (a, b) {
        return b.date - a.date // date 기준으로 내림차순 정렬
      })
    },
    sortUniqueDate () {
      const dates = this.orderItems.map(a => a.date)
      const uniqueDates = Array.from(new Set(dates))
      return uniqueDates // 중복 제거해서 날짜만 저장
    }
  },
  methods: {
    RequestItem () {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/storage',
        dataType: 'json',
        success: function (data) {
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            if (!this.tempUnique.includes(data[i].lecture_name + ';' + data[i].date)) {
              this.tempUnique.push(data[i].lecture_name + ';' + data[i].date)
              this.items.push({
                lecture_name: data[i].lecture_name,
                date: data[i].date,
                image: 'data:image/jpeg;base64,' + data[i].image,
                keyword: data[i].keyword})
            }
          }
          this.request = true
        }.bind(this)
      }).catch(error => {
        console.log(error.message)
      })
    },
    showReview (lecture, date, keyword) {
      this.$router.push({name: 'Review', params: { lecture_name: lecture, date: date, keyword: keyword }})
    }
  }
}
</script>

<style scoped lang="scss">
.myPdfFiles { li { list-style:none; } }

.scroll{ overflow-y: scroll; }
.type1::-webkit-scrollbar{ width: 6px; }
.type1::-webkit-scrollbar-thumb{ height: 7%; background-color: rgb(223, 223, 223); border-radius: 15px; }
.type1::-webkit-scrollbar-track{ background-color: white; }

.card1 {
    border: solid 1px rgb(223, 223, 223); margin-bottom: 5px;
    .card1-title { color: black; }
    .card1-header { background: black; }
}

.nanumgothic * {
 font-family: 'Nanum Gothic', sans-serif;
 font-weight: 500;
}

.zoom {
  transition: transform .2s; /* Animation */
}

.zoom:hover {
  transform: scale(1.1); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
  z-index: 1;
}
</style>
