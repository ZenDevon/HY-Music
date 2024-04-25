// components/area-header/area-header.js
Component({
  properties: {
    title: {
      type: 'Strirng',
      value: '默认标题'
    },
    hasMore: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    onMoretap() {
      this.triggerEvent('moreclick')
    }
  }
})