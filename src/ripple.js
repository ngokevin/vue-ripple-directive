const Ripple = {
  bind: function (el, binding) {
    // Default values.
    let props = {event: 'mousedown', transition: Ripple.transition || 600};

    setProps(Object.keys(binding.modifiers), props);

    let touchStartClientX;
    let touchStartClientY;
    el.addEventListener('touchstart', evt => {
      touchStartClientX = event.touches[0].clientX;
      touchStartClientY = event.touches[0].clientY;
    });

    el.addEventListener('touchend', evt => {
      rippler(evt, el, binding.value);
      touchStartClientX = null;
      touchStartClientY = null;
    });

    el.addEventListener('mousedown', evt => {
      rippler(evt, el, binding.value);
    });

    let bg = binding.value || Ripple.color || 'rgba(0, 0, 0, 0.35)';
    let zIndex = Ripple.zIndex || '1';

    function rippler (event, el) {
      let target = el;
      // Get border to avoid offsetting on ripple container position.
      let targetBorder = parseInt((getComputedStyle(target).borderWidth).replace('px', ''));

      let clientX = touchStartClientX || event.clientX;
      let clientY = touchStartClientY || event.clientY;

      // Get necessary variables.
      let rect = target.getBoundingClientRect();
      let left = rect.left;
      let top  = rect.top;
      let width  = target.offsetWidth;
      let height = target.offsetHeight;
      let dx = clientX - left;
      let dy = clientY - top;
      let maxX = Math.max(dx, width - dx);
      let maxY = Math.max(dy, height - dy);
      let style  = window.getComputedStyle(target);
      let radius = Math.sqrt((maxX * maxX) + (maxY * maxY));
      let border = (targetBorder > 0 ) ? targetBorder : 0;

      // Create the ripple and its container.
      let ripple = document.createElement('div');
      let rippleContainer = document.createElement('div');
      ripple.className = 'ripple';
      rippleContainer.className = 'ripple-container';

      // Styles for ripple.
      ripple.style.marginTop = '0px';
      ripple.style.marginLeft = '0px';
      ripple.style.width = '1px';
      ripple.style.height = '1px';
      ripple.style.transition = 'all ' + props.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.position = 'relative';
      ripple.style.zIndex = -1;
      ripple.style.backgroundColor = bg;

      // Styles for rippleContainer.
      rippleContainer.style.position= 'absolute';
      rippleContainer.style.left = 0 - border + 'px';
      rippleContainer.style.top = 0 - border + 'px';
      rippleContainer.style.height = '0';
      rippleContainer.style.width = '0';
      rippleContainer.style.pointerEvents = 'none';
      rippleContainer.style.overflow = 'hidden';

      // Store target position to change it after.
      let storedTargetPosition =  ((target.style.position).length > 0) ? target.style.position : getComputedStyle(target).position;
      // Change target position to relative to guarantee ripples correct positioning.
      if (storedTargetPosition !== 'relative') {
        target.style.position = 'relative';
      }

      rippleContainer.appendChild(ripple);
      target.prepend(rippleContainer);

      ripple.style.marginLeft = dx + 'px';
      ripple.style.marginTop = dy + 'px';

      // No need to set positioning because ripple should be child of target and to it's relative position.
      // rippleContainer.style.left = left + (((window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0)) || 0) + 'px';
      // rippleContainer.style.top = top + (((window.pageYOffset || document.scrollTop) - (document.clientTop || 0)) || 0) + 'px';
      rippleContainer.style.width = width + 'px';
      rippleContainer.style.height = height + 'px';
      rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
      rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
      rippleContainer.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
      rippleContainer.style.borderBottomRightRadius = style.borderBottomRightRadius;

      rippleContainer.style.direction = 'ltr';

      setTimeout(function () {
        ripple.style.width = radius * 2 + 'px';
        ripple.style.height = radius * 2 + 'px';
        ripple.style.marginLeft = dx - radius + 'px';
        ripple.style.marginTop = dy - radius + 'px';
      }, 0);

      if (event.type === 'mousedown') {
        el.addEventListener('mouseup', clearRipple, false);
      } else {
        setTimeout(() => {
          clearRipple();
        }, props.transition);
      }

      function clearRipple () {
        setTimeout(function () {
          ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }, 250);

        // Timeout set to get a smooth removal of the ripple.
        setTimeout(function () {
          rippleContainer.parentNode.removeChild(rippleContainer);
        }, 850);

        el.removeEventListener('mouseup', clearRipple, false);

        // After removing event set position to target to it's original one.
        // Timeout it's needed to avoid jerky effect of ripple jumping out parent target.
        setTimeout(function () {
          let clearPosition = true;
          for(let i = 0; i < target.childNodes.length; i++) {
            if(target.childNodes[i].className === 'ripple-container') {
              clearPosition = false;
            }
          }

          if(clearPosition) {
            if(storedTargetPosition !== 'static') {
              target.style.position = storedTargetPosition;
            } else {
              target.style.position = '';
            }
          }
        }, props.transition + 250)
      }
    }
  }
};

function setProps (modifiers, props) {
  modifiers.forEach(item => {
    if(isNaN(Number(item)))
      props.event = item;
    else
      props.transition = item;
  });
}

export default Ripple;