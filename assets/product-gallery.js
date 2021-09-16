class ProductGallery extends HTMLElement {
    constructor() {
      super();
      this.init()
  
      // Add resize observer to update container height
      const resizeObserver = new ResizeObserver(entries => this.update());
      resizeObserver.observe(this);
  
      // Bind event listeners
      this.navItems.forEach(item => item.addEventListener('click', this.onNavItemClick.bind(this)))
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
      // Listen for variant selection change to make current variant image active
      window.addEventListener('message', this.onVariantChange.bind(this))
    }
  
    init() {
      // Set up our DOM element variables
      this.imagesContainer = this.querySelector('.product-gallery__images');
      this.navItems = this.querySelectorAll('.product-gallery__nav-item');
      this.images = this.querySelectorAll('.product-gallery__image');
      this.prevButton = this.querySelector('button[name="previous"]');
      this.nextButton = this.querySelector('button[name="next"]');
      // If there is no active images set the first image to active
      if (this.findCurrentIndex() === -1) {
        this.setCurrentImage(this.images[0])
      }
    }
  
    onVariantChange(event) {
      if (!event.data || event.data.type !== 'variant_changed') return 
      const currentImage = Array.from(this.images).find(item => item.dataset.mediaId == event.data.variant.featured_media.id)
      if (currentImage) {
        this.setCurrentImage(currentImage)
      }
    }
  
    onNavItemClick(event) {
      const mediaId = event.target.closest('li').dataset.mediaId
      this.images.forEach(item => item.classList.remove('product-gallery__image--active'))
      this.setCurrentImage(Array.from(this.images).find(item => item.dataset.mediaId === mediaId))
    }
  
    update() {
      this.style.height = `${this.imagesContainer.offsetHeight}px`
      this.prevButton.removeAttribute('disabled')
      this.nextButton.removeAttribute('disabled')
      if (this.findCurrentIndex() === 0) this.prevButton.setAttribute('disabled', true)
      if (this.findCurrentIndex() === this.images.length - 1) this.nextButton.setAttribute('disabled', true)
    }
  
    setCurrentImage(elem) {
      this.images.forEach(item => item.classList.remove('product-gallery__image--active'))
      elem.classList.add('product-gallery__image--active')
      this.update()
    }
  
    findCurrentIndex() {
      return Array.from(this.images).findIndex(item => item.classList.contains('product-gallery__image--active'))
    }
  
    onButtonClick(event) {
      event.preventDefault();
      let index = this.findCurrentIndex()
      if (event.currentTarget.name === 'next') {
        index++
      } else {
        index--
      }
      this.setCurrentImage(this.images[index])
    }
  }
  
  customElements.define('product-gallery', ProductGallery);