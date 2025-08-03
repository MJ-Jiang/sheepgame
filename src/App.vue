<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Card from './components/card.vue'
import { useGame } from './core/useGame'
import { basicCannon, schoolPride } from './core/utils'

const containerRef = ref<HTMLElement | undefined>()
const clickAudioRef = ref<HTMLAudioElement | undefined>()
const dropAudioRef = ref<HTMLAudioElement | undefined>()
const winAudioRef = ref<HTMLAudioElement | undefined>()
const loseAudioRef = ref<HTMLAudioElement | undefined>()
const welAudioRef = ref<HTMLAudioElement | undefined>()
const finalAudioRef = ref<HTMLAudioElement | undefined>()


const curLevel = ref(1)
const showTip = ref(false)
const LevelConfig = [
  { cardNum: 4, layerNum: 2, trap: false },
  { cardNum: 9, layerNum: 3, trap: false },
  { cardNum: 15, layerNum: 6, trap: false },
]

const isWin = ref(false)

const {
  nodes,
  selectedNodes,
  handleSelect,
  handleBack,
  backFlag,
  handleRemove,
  removeFlag,
  removeList,
  handleSelectRemove,
  initData,
} = useGame({
  container: containerRef,
  cardNum: 4,
  layerNum: 2,
  trap: false,
  events: {
    clickCallback: handleClickCard,
    dropCallback: handleDropCard,
    winCallback: handleWin,
    loseCallback: handleLose,
  },
})

function handleClickCard() {
  if (clickAudioRef.value?.paused) {
    clickAudioRef.value.play()
  }
  else if (clickAudioRef.value) {
    clickAudioRef.value.load()
    clickAudioRef.value.play()
  }
}

function handleDropCard() {
  dropAudioRef.value?.play()
}

function handleWin() {
  if(curLevel.value===LevelConfig.length){
    finalAudioRef.value?.play()
  }else{
      winAudioRef.value?.play()
  }

  // fireworks()
  if (curLevel.value < LevelConfig.length) {
    basicCannon()
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 1500)
    setTimeout(() => {
      initData(LevelConfig[curLevel.value])
      curLevel.value++
    }, 2000)
  }
  else {
    isWin.value = true
    schoolPride()
  }
}

function handleLose() {
  loseAudioRef.value?.play()
  setTimeout(() => {
    alert('槽位已满，再接再厉~')
    // window.location.reload()
    nodes.value = []
    removeList.value = []
    selectedNodes.value = []
    welAudioRef.value?.play()
    curLevel.value = 0
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 1500)
    setTimeout(() => {
      initData(LevelConfig[curLevel.value])
      curLevel.value++
    }, 2000)
  }, 500)
}




</script>

<template>
  <div flex flex-col w-full h-full>
    <div class="w-full h-[60px] mt-[10px] flex items-center justify-center text-[32px] font-semibold text-center" style="color: #545454;">
  <img src="lemon.png" alt="柠" class="h-[48px] w-auto mx-[8px] align-middle" />
  <span class="inline-block mx-[4px]">了个</span>
  <img src="lemon.png" alt="柠" class="h-[48px] w-auto relative left-[-4px] align-middle" />
</div>


<!-- 卡牌区域：始终居中在标题和底部卡槽之间 -->
<div class="flex-1 flex justify-center" :class="curLevel >= 3 ? 'items-start' : 'items-center'">
  <div
    class="relative"
    ref="containerRef"
    :style="{
      width: '360px',
      height: 'auto',
      marginTop: curLevel >= 2 ? '100px' : '0',
    }"
  >

    <template v-for="item in nodes" :key="item.id">
      <transition name="slide-fade">
        <Card
          v-if="[0, 1].includes(item.state)"
          :node="item"
          @click-card="handleSelect"
        />
      </transition>
    </template>
  </div>

<transition name="fade-bounce">
  <div
    v-if="isWin"
    class="fixed left-1/2 top-1/2 z-50 text-center px-6 py-3 rounded-xl shadow-lg whitespace-nowrap"
    style="
      transform: translate(-50%, -50%);
      background-color: #FFF5C7;
      color: #545454;
      font-size: 30px;
      font-weight: 600;
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    "
  >
    🎉 成功加入柠圈 ~
  </div>
</transition>





  <transition name="fade-bounce">
    <div
      v-if="showTip"
      class="fixed left-1/2 top-1/2 z-50 text-[28px] font-bold text-black bg-[#FFF5C7] px-4 py-2 rounded shadow-md"
      style="transform: translate(-50%, -50%); color:#545454"
    >
      第{{ curLevel + 1 }}关
    </div>
  </transition>
</div>


    <div text-center h-50px flex items-center justify-center>
      <Card
        v-for="item in removeList" :key="item.id" :node="item"
        is-dock
        @click-card="handleSelectRemove"
      />
    </div>
    <div w-full flex items-center justify-center>
      <div border="~ 4px dashed #FFF5C7" w-295px h-44px flex>
        <template v-for="item in selectedNodes" :key="item.id">
          <transition name="bounce">
            <Card
              v-if="item.state === 2"
              :node="item"
              is-dock
            />
          </transition>
        </template>
      </div>
    </div>

    <div h-50px flex items-center w-full justify-center>
<button
  :disabled="removeFlag"
  :class="removeFlag?'text-[#ccc]':'text-[#545454]'"
  mr-10px
  @click="handleRemove"
  style="background-color: #FFF5C7; "
>
  移出前三个
</button>

<button
  :disabled="backFlag"
  :class="backFlag?'text-[#ccc]':'text-[#545454]'"
  @click="handleBack"
  style="background-color: #FFF5C7; "
>
  回退
</button>


    </div>
    <div w-full color="#FFF5C7" fw-600 text-center pb-10px>
      <span mr-20px style="color:#FFF5C7">designer: finMomo</span>
      by: Xc
      <a
        class="icon-btn"
        color="#FFF5C7"
        i-carbon-logo-github
        rel="noreferrer"
        href="https://github.com/chenxch"
        target="_blank"
        title="GitHub"

      />
      <span
        text-12px
        color="#00000018"
      >
        <span
          class="icon-btn"
          text-2
          i-carbon:arrow-up-left
        />
        star buff</span>
    </div>
    <audio
      ref="clickAudioRef"
      style="display: none;"
      controls
      src="./audio/click.mp3"
    />
    <audio
      ref="dropAudioRef"
      style="display: none;"
      controls
      src="./audio/drop.mp3"
    />
    <audio
      ref="winAudioRef"
      style="display: none;"
      controls
      src="./audio/win.mp3"
    />
    <audio
      ref="loseAudioRef"
      style="display: none;"
      controls
      src="./audio/lose.mp3"
    />
    <audio
      ref="welAudioRef"
      style="display: none;"
      controls
      src="./audio/welcome.mp3"
    />
    <audio
  ref="finalAudioRef"
  style="display: none;"
  controls
  src="./audio/final.mp3"
/>

  </div>
</template>

<style>
body{
  background-color: #FFD64F;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(25vh);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
