<template lang="html">
  <section class="myPdfFiles">
    <div class="row">
      <div class="col-md-12 grid-margin">
        <div class="card">
          <div class="card-body">
            <ul v-for="(date, idx) of sortUniqueDate" :key="idx" >
              <h5>{{ date.substring(0, 4) }}.{{ date.substring(4, 6) }}.{{ date.substring(6, 8) }}.</h5>
              <li v-for="item in orderItems" v-bind:key="item.lecture_name" v-if="date==item.date">
                <div @click="showReview(item.lecture_name, item.date)"><i class="mdi mdi-note-text"></i> {{ item.lecture_name }} {{ item.date }}</div>
              </li>
              <br>
            </ul>
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
            this.items.push({lecture_name: data[i].lecture_name, date: data[i].date})
          }
          this.request = true
        }.bind(this)
      }).catch(error => {
        console.log(error.message)
      })
    },
    showReview (lecture, date) {
      this.$router.push({name: 'Review', params: { lecture_name: lecture, date: date }})
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
</style>
