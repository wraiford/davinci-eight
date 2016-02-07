System.register("davinci-eight/slideshow/SlideCommands.js", ["../collections/IUnknownArray", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var IUnknownArray_1,
      Shareable_1;
  var SlideCommands;
  return {
    setters: [function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      SlideCommands = (function(_super) {
        __extends(SlideCommands, _super);
        function SlideCommands() {
          _super.call(this, 'SlideCommands');
          this.commands = new IUnknownArray_1.default();
        }
        SlideCommands.prototype.destructor = function() {
          this.commands.release();
          this.commands = void 0;
          _super.prototype.destructor.call(this);
        };
        SlideCommands.prototype.pushWeakRef = function(command) {
          return this.commands.pushWeakRef(command);
        };
        SlideCommands.prototype.redo = function(slide, director) {
          for (var i = 0,
              iLength = this.commands.length; i < iLength; i++) {
            this.commands.getWeakRef(i).redo(slide, director);
          }
        };
        SlideCommands.prototype.undo = function(slide, director) {
          for (var i = this.commands.length - 1; i >= 0; i--) {
            this.commands.getWeakRef(i).undo(slide, director);
          }
        };
        return SlideCommands;
      })(Shareable_1.default);
      exports_1("default", SlideCommands);
    }
  };
});

System.register("davinci-eight/slideshow/Slide.js", ["../collections/IUnknownArray", "../core/Shareable", "../slideshow/SlideCommands", "../collections/StringIUnknownMap"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var IUnknownArray_1,
      Shareable_1,
      SlideCommands_1,
      StringIUnknownMap_1;
  var Slide,
      AnimationLane,
      Mirror;
  return {
    setters: [function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(SlideCommands_1_1) {
      SlideCommands_1 = SlideCommands_1_1;
    }, function(StringIUnknownMap_1_1) {
      StringIUnknownMap_1 = StringIUnknownMap_1_1;
    }],
    execute: function() {
      Slide = (function(_super) {
        __extends(Slide, _super);
        function Slide() {
          _super.call(this, 'Slide');
          this.now = 0;
          this.prolog = new SlideCommands_1.default();
          this.epilog = new SlideCommands_1.default();
          this.targets = [];
          this.mirrors = new StringIUnknownMap_1.default();
        }
        Slide.prototype.destructor = function() {
          this.prolog.release();
          this.prolog = void 0;
          this.epilog.release();
          this.epilog = void 0;
          this.targets = void 0;
          this.mirrors.release();
          this.mirrors = void 0;
          _super.prototype.destructor.call(this);
        };
        Slide.prototype.ensureTarget = function(target) {
          if (this.targets.indexOf(target) < 0) {
            this.targets.push(target);
          }
        };
        Slide.prototype.ensureMirror = function(target) {
          if (!this.mirrors.exists(target.uuid)) {
            this.mirrors.putWeakRef(target.uuid, new Mirror());
          }
        };
        Slide.prototype.pushAnimation = function(target, propName, animation) {
          this.ensureTarget(target);
          this.ensureMirror(target);
          var mirror = this.mirrors.getWeakRef(target.uuid);
          mirror.ensureAnimationLane(propName);
          var animationLane = mirror.animationLanes.getWeakRef(propName);
          animationLane.push(animation);
        };
        Slide.prototype.popAnimation = function(target, propName) {
          var mirror = this.mirrors.getWeakRef(target.uuid);
          var animationLane = mirror.animationLanes.getWeakRef(propName);
          return animationLane.pop();
        };
        Slide.prototype.advance = function(interval) {
          this.now += interval;
          for (var i = 0,
              iLength = this.targets.length; i < iLength; i++) {
            var target = this.targets[i];
            var offset = 0;
            var mirror = this.mirrors.getWeakRef(target.uuid);
            var names = mirror.animationLanes.keys;
            for (var j = 0; j < names.length; j++) {
              var propName = names[j];
              var animationLane = mirror.animationLanes.getWeakRef(propName);
              offset = animationLane.apply(target, propName, this.now, offset);
            }
          }
        };
        Slide.prototype.doProlog = function(director, forward) {
          if (forward) {
            this.prolog.redo(this, director);
          } else {
            this.prolog.undo(this, director);
          }
        };
        Slide.prototype.doEpilog = function(director, forward) {
          if (forward) {
            this.epilog.redo(this, director);
          } else {
            this.epilog.undo(this, director);
          }
        };
        Slide.prototype.undo = function(director) {
          for (var i = 0,
              iLength = this.targets.length; i < iLength; i++) {
            var target = this.targets[i];
            var mirror = this.mirrors.getWeakRef(target.uuid);
            var names = mirror.animationLanes.keys;
            for (var j = 0; j < names.length; j++) {
              var propName = names[j];
              var animationLane = mirror.animationLanes.getWeakRef(propName);
              animationLane.undo(target, propName);
            }
          }
        };
        return Slide;
      })(Shareable_1.default);
      exports_1("default", Slide);
      AnimationLane = (function(_super) {
        __extends(AnimationLane, _super);
        function AnimationLane() {
          _super.call(this, 'AnimationLane');
          this.completed = new IUnknownArray_1.default();
          this.remaining = new IUnknownArray_1.default();
        }
        AnimationLane.prototype.destructor = function() {
          this.completed.release();
          this.completed = void 0;
          this.remaining.release();
          this.remaining = void 0;
          _super.prototype.destructor.call(this);
        };
        AnimationLane.prototype.pop = function() {
          if (this.remaining.length > 0) {
            return this.remaining.pop();
          } else {
            return this.completed.pop();
          }
        };
        AnimationLane.prototype.push = function(animation) {
          return this.remaining.push(animation);
        };
        AnimationLane.prototype.pushWeakRef = function(animation) {
          return this.remaining.pushWeakRef(animation);
        };
        AnimationLane.prototype.apply = function(target, propName, now, offset) {
          var done = false;
          while (!done) {
            if (this.remaining.length > 0) {
              var animation = this.remaining.getWeakRef(0);
              animation.apply(target, propName, now, offset);
              if (animation.done(target, propName)) {
                offset = animation.extra(now);
                this.completed.push(this.remaining.shift());
              } else {
                done = true;
              }
            } else {
              done = true;
            }
          }
          return offset;
        };
        AnimationLane.prototype.undo = function(target, propName) {
          while (this.completed.length > 0) {
            this.remaining.unshift(this.completed.pop());
          }
          for (var i = this.remaining.length - 1; i >= 0; i--) {
            var animation = this.remaining.getWeakRef(i);
            animation.undo(target, propName);
          }
        };
        return AnimationLane;
      })(Shareable_1.default);
      Mirror = (function(_super) {
        __extends(Mirror, _super);
        function Mirror() {
          _super.call(this, 'Mirror');
          this.animationLanes = new StringIUnknownMap_1.default();
        }
        Mirror.prototype.destructor = function() {
          this.animationLanes.release();
          this.animationLanes = void 0;
          _super.prototype.destructor.call(this);
        };
        Mirror.prototype.ensureAnimationLane = function(key) {
          if (!this.animationLanes.exists(key)) {
            this.animationLanes.putWeakRef(key, new AnimationLane());
          }
        };
        return Mirror;
      })(Shareable_1.default);
    }
  };
});

System.register("davinci-eight/slideshow/Director.js", ["../slideshow/Slide", "../collections/IUnknownArray", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Slide_1,
      IUnknownArray_1,
      Shareable_1;
  var Director;
  return {
    setters: [function(Slide_1_1) {
      Slide_1 = Slide_1_1;
    }, function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      Director = (function(_super) {
        __extends(Director, _super);
        function Director() {
          _super.call(this, 'Director');
          this.step = -1;
          this.slides = new IUnknownArray_1.default([]);
          this.facets = {};
        }
        Director.prototype.destructor = function() {
          this.slides.release();
          this.slides = void 0;
          this.facets = void 0;
        };
        Director.prototype.addFacet = function(facet, facetName) {
          this.facets[facetName] = facet;
        };
        Director.prototype.getFacet = function(facetName) {
          return this.facets[facetName];
        };
        Director.prototype.removeFacet = function(facetName) {
          var facet = this.getFacet(facetName);
          delete this.facets[facetName];
          return facet;
        };
        Director.prototype.createSlide = function() {
          return new Slide_1.default();
        };
        Director.prototype.go = function(step, instant) {
          if (instant === void 0) {
            instant = false;
          }
          if (this.slides.length === 0) {
            return;
          }
          while (step < 0)
            step += this.slides.length + 1;
        };
        Director.prototype.forward = function(instant, delay) {
          if (instant === void 0) {
            instant = true;
          }
          if (delay === void 0) {
            delay = 0;
          }
          if (!this.canForward()) {
            return;
          }
          var slideLeaving = this.slides.getWeakRef(this.step);
          var slideEntering = this.slides.getWeakRef(this.step + 1);
          var self = this;
          var apply = function() {
            if (slideLeaving) {
              slideLeaving.doEpilog(self, true);
            }
            if (slideEntering) {
              slideEntering.doProlog(self, true);
            }
            self.step++;
          };
          if (delay) {
            setTimeout(apply, delay);
          } else {
            apply();
          }
        };
        Director.prototype.canForward = function() {
          return this.step < this.slides.length;
        };
        Director.prototype.backward = function(instant, delay) {
          if (instant === void 0) {
            instant = true;
          }
          if (delay === void 0) {
            delay = 0;
          }
          if (!this.canBackward()) {
            return;
          }
          var slideLeaving = this.slides.getWeakRef(this.step);
          var slideEntering = this.slides.getWeakRef(this.step - 1);
          var self = this;
          var apply = function() {
            if (slideLeaving) {
              slideLeaving.undo(self);
              slideLeaving.doProlog(self, false);
            }
            if (slideEntering) {
              slideEntering.doEpilog(self, false);
            }
            self.step--;
          };
          if (delay) {
            setTimeout(apply, delay);
          } else {
            apply();
          }
        };
        Director.prototype.canBackward = function() {
          return this.step > -1;
        };
        Director.prototype.pushSlide = function(slide) {
          return this.slides.push(slide);
        };
        Director.prototype.popSlide = function(slide) {
          return this.slides.pop();
        };
        Director.prototype.advance = function(interval) {
          var slideIndex = this.step;
          if (slideIndex >= 0 && slideIndex < this.slides.length) {
            var slide = this.slides.get(slideIndex);
            if (slide) {
              try {
                slide.advance(interval);
              } finally {
                slide.release();
              }
            } else {
              console.warn("No slide found at index " + this.step);
            }
          }
        };
        return Director;
      })(Shareable_1.default);
      exports_1("default", Director);
    }
  };
});

System.register("davinci-eight/slideshow/DirectorKeyboardHandler.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var DirectorKeyboardHandler;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      DirectorKeyboardHandler = (function(_super) {
        __extends(DirectorKeyboardHandler, _super);
        function DirectorKeyboardHandler(director) {
          _super.call(this, 'DirectorKeyboardHandler');
          this.director = director;
          this.director.addRef();
        }
        DirectorKeyboardHandler.prototype.destructor = function() {
          this.director.release();
          this.director = void 0;
          _super.prototype.destructor.call(this);
        };
        DirectorKeyboardHandler.prototype.keyDown = function(event) {};
        DirectorKeyboardHandler.prototype.keyUp = function(event) {
          switch (event.keyCode) {
            case 37:
              {
                this.director.backward();
              }
              break;
            case 39:
              {
                this.director.forward();
              }
            default:
              {}
          }
        };
        return DirectorKeyboardHandler;
      })(Shareable_1.default);
      exports_1("default", DirectorKeyboardHandler);
    }
  };
});

System.register("davinci-eight/slideshow/animations/WaitAnimation.js", ["../../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var WaitAnimation;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WaitAnimation = (function(_super) {
        __extends(WaitAnimation, _super);
        function WaitAnimation(duration) {
          _super.call(this, 'WaitAnimation');
          this.duration = duration;
          this.fraction = 0;
        }
        WaitAnimation.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        WaitAnimation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
          }
          if (this.duration > 0) {
            this.fraction = Math.min(1, (now - this.start) / this.duration);
          } else {
            this.fraction = 1;
          }
        };
        WaitAnimation.prototype.skip = function() {
          this.duration = 0;
        };
        WaitAnimation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        WaitAnimation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        WaitAnimation.prototype.done = function(target, propName) {
          return this.fraction === 1;
        };
        WaitAnimation.prototype.undo = function(target, propName) {
          this.start = void 0;
          this.fraction = 0;
        };
        return WaitAnimation;
      })(Shareable_1.default);
      exports_1("default", WaitAnimation);
    }
  };
});

System.register("davinci-eight/slideshow/animations/ColorAnimation.js", ["../../core/Shareable", "../../core/Color"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1,
      Color_1;
  var ColorAnimation;
  function loop(n, callback) {
    for (var i = 0; i < n; ++i) {
      callback(i);
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(Color_1_1) {
      Color_1 = Color_1_1;
    }],
    execute: function() {
      ColorAnimation = (function(_super) {
        __extends(ColorAnimation, _super);
        function ColorAnimation(color, duration, callback, ease) {
          if (duration === void 0) {
            duration = 300;
          }
          _super.call(this, 'ColorAnimation');
          this.from = void 0;
          this.to = Color_1.default.fromColor(color);
          this.duration = duration;
          this.start = 0;
          this.fraction = 0;
          this.callback = callback;
          this.ease = ease;
        }
        ColorAnimation.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        ColorAnimation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
              var data = target.getProperty(propName);
              if (data) {
                this.from = Color_1.default.fromCoords(data);
              }
            }
          }
          var from = this.from;
          var to = this.to;
          var ease = this.ease;
          var fraction;
          if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
          } else {
            fraction = 1;
          }
          this.fraction = fraction;
          var rolloff;
          switch (ease) {
            case 'in':
              rolloff = 1 - (1 - fraction) * (1 - fraction);
              break;
            case 'out':
              rolloff = fraction * fraction;
              break;
            case 'linear':
              rolloff = fraction;
              break;
            default:
              rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
              break;
          }
          target.setProperty(propName, Color_1.default.interpolate(from, to, rolloff).coords);
        };
        ColorAnimation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        ColorAnimation.prototype.skip = function(target, propName) {
          this.duration = 0;
          this.fraction = 1;
          this.done(target, propName);
        };
        ColorAnimation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        ColorAnimation.prototype.done = function(target, propName) {
          if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback();
            this.callback = void 0;
            return true;
          } else {
            return false;
          }
        };
        ColorAnimation.prototype.undo = function(target, propName) {
          if (this.from) {
            target.setProperty(propName, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
          }
        };
        return ColorAnimation;
      })(Shareable_1.default);
      exports_1("default", ColorAnimation);
    }
  };
});

System.register("davinci-eight/slideshow/animations/Vector2Animation.js", ["../../core/Shareable", "../../math/R2"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1,
      R2_1;
  var Vector2Animation;
  function loop(n, callback) {
    for (var i = 0; i < n; ++i) {
      callback(i);
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }],
    execute: function() {
      Vector2Animation = (function(_super) {
        __extends(Vector2Animation, _super);
        function Vector2Animation(value, duration, callback, ease) {
          if (duration === void 0) {
            duration = 300;
          }
          _super.call(this, 'Vector2Animation');
          this.to = R2_1.default.copy(value);
          this.duration = duration;
          this.fraction = 0;
          this.callback = callback;
          this.ease = ease;
        }
        Vector2Animation.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Vector2Animation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
              var data = target.getProperty(propName);
              if (data) {
                this.from = new R2_1.default(data);
              }
            }
          }
          var ease = this.ease;
          var fraction;
          if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
          } else {
            fraction = 1;
          }
          this.fraction = fraction;
          var rolloff;
          switch (ease) {
            case 'in':
              rolloff = 1 - (1 - fraction) * (1 - fraction);
              break;
            case 'out':
              rolloff = fraction * fraction;
              break;
            case 'linear':
              rolloff = fraction;
              break;
            default:
              rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
              break;
          }
          var lerp = R2_1.default.lerp(this.from, this.to, rolloff);
          target.setProperty(propName, lerp.coords);
        };
        Vector2Animation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Vector2Animation.prototype.skip = function(target, propName) {
          this.duration = 0;
          this.fraction = 1;
          this.done(target, propName);
        };
        Vector2Animation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        Vector2Animation.prototype.done = function(target, propName) {
          if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback();
            this.callback = void 0;
            return true;
          } else {
            return false;
          }
        };
        Vector2Animation.prototype.undo = function(target, propName) {
          if (this.from) {
            target.setProperty(propName, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
          }
        };
        return Vector2Animation;
      })(Shareable_1.default);
      exports_1("default", Vector2Animation);
    }
  };
});

System.register("davinci-eight/slideshow/animations/Vector3Animation.js", ["../../core/Shareable", "../../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1,
      R3_1;
  var Vector3Animation;
  function loop(n, callback) {
    for (var i = 0; i < n; ++i) {
      callback(i);
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      Vector3Animation = (function(_super) {
        __extends(Vector3Animation, _super);
        function Vector3Animation(value, duration, callback, ease) {
          if (duration === void 0) {
            duration = 300;
          }
          _super.call(this, 'Vector3Animation');
          this.to = R3_1.default.copy(value);
          this.duration = duration;
          this.fraction = 0;
          this.callback = callback;
          this.ease = ease;
        }
        Vector3Animation.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Vector3Animation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
              var data = target.getProperty(propName);
              if (data) {
                this.from = new R3_1.default().copyCoordinates(data);
              }
            }
          }
          var ease = this.ease;
          var fraction;
          if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
          } else {
            fraction = 1;
          }
          this.fraction = fraction;
          var rolloff;
          switch (ease) {
            case 'in':
              rolloff = 1 - (1 - fraction) * (1 - fraction);
              break;
            case 'out':
              rolloff = fraction * fraction;
              break;
            case 'linear':
              rolloff = fraction;
              break;
            default:
              rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
              break;
          }
          var lerp = R3_1.default.lerp(this.from, this.to, rolloff);
          target.setProperty(propName, lerp.coords);
        };
        Vector3Animation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Vector3Animation.prototype.skip = function(target, propName) {
          this.duration = 0;
          this.fraction = 1;
          this.done(target, propName);
        };
        Vector3Animation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        Vector3Animation.prototype.done = function(target, propName) {
          if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback();
            this.callback = void 0;
            return true;
          } else {
            return false;
          }
        };
        Vector3Animation.prototype.undo = function(target, propName) {
          if (this.from) {
            target.setProperty(propName, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
          }
        };
        return Vector3Animation;
      })(Shareable_1.default);
      exports_1("default", Vector3Animation);
    }
  };
});

System.register("davinci-eight/slideshow/animations/Spinor2Animation.js", ["../../core/Shareable", "../../math/SpinG2"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1,
      SpinG2_1;
  var Spinor2Animation;
  function loop(n, callback) {
    for (var i = 0; i < n; ++i) {
      callback(i);
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(SpinG2_1_1) {
      SpinG2_1 = SpinG2_1_1;
    }],
    execute: function() {
      Spinor2Animation = (function(_super) {
        __extends(Spinor2Animation, _super);
        function Spinor2Animation(value, duration, callback, ease) {
          if (duration === void 0) {
            duration = 300;
          }
          _super.call(this, 'Spinor2Animation');
          this.from = void 0;
          this.to = SpinG2_1.default.copy(value);
          this.duration = duration;
          this.start = 0;
          this.fraction = 0;
          this.callback = callback;
          this.ease = ease;
        }
        Spinor2Animation.prototype.destructor = function() {};
        Spinor2Animation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
              var data = target.getProperty(propName);
              if (data) {
                this.from = new SpinG2_1.default();
                this.from.coords = data;
              }
            }
          }
          var from = this.from;
          var to = this.to;
          var ease = this.ease;
          var fraction;
          if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
          } else {
            fraction = 1;
          }
          this.fraction = fraction;
          var rolloff;
          switch (ease) {
            case 'in':
              rolloff = 1 - (1 - fraction) * (1 - fraction);
              break;
            case 'out':
              rolloff = fraction * fraction;
              break;
            case 'linear':
              rolloff = fraction;
              break;
            default:
              rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
              break;
          }
          var lerp = SpinG2_1.default.lerp(from, to, fraction);
          target.setProperty(propName, lerp.coords);
        };
        Spinor2Animation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor2Animation.prototype.skip = function(target, propName) {
          this.duration = 0;
          this.fraction = 1;
          this.done(target, propName);
        };
        Spinor2Animation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        Spinor2Animation.prototype.done = function(target, propName) {
          if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback();
            this.callback = void 0;
            return true;
          } else {
            return false;
          }
        };
        Spinor2Animation.prototype.undo = function(target, propName) {
          if (this.from) {
            target.setProperty(propName, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
          }
        };
        return Spinor2Animation;
      })(Shareable_1.default);
      exports_1("default", Spinor2Animation);
    }
  };
});

System.register("davinci-eight/slideshow/animations/Spinor3Animation.js", ["../../core/Shareable", "../../math/SpinG3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1,
      SpinG3_1;
  var Spinor3Animation;
  function loop(n, callback) {
    for (var i = 0; i < n; ++i) {
      callback(i);
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }],
    execute: function() {
      Spinor3Animation = (function(_super) {
        __extends(Spinor3Animation, _super);
        function Spinor3Animation(value, duration, callback, ease) {
          if (duration === void 0) {
            duration = 300;
          }
          _super.call(this, 'Spinor3Animation');
          this.from = void 0;
          this.to = SpinG3_1.default.copy(value);
          this.duration = duration;
          this.start = 0;
          this.fraction = 0;
          this.callback = callback;
          this.ease = ease;
        }
        Spinor3Animation.prototype.destructor = function() {};
        Spinor3Animation.prototype.apply = function(target, propName, now, offset) {
          if (!this.start) {
            this.start = now - offset;
            if (this.from === void 0) {
              var data = target.getProperty(propName);
              if (data) {
                this.from = new SpinG3_1.default();
                this.from.coords = data;
              }
            }
          }
          var from = this.from;
          var to = this.to;
          var ease = this.ease;
          var fraction;
          if (this.duration > 0) {
            fraction = Math.min(1, (now - this.start) / (this.duration || 1));
          } else {
            fraction = 1;
          }
          this.fraction = fraction;
          var rolloff;
          switch (ease) {
            case 'in':
              rolloff = 1 - (1 - fraction) * (1 - fraction);
              break;
            case 'out':
              rolloff = fraction * fraction;
              break;
            case 'linear':
              rolloff = fraction;
              break;
            default:
              rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI);
              break;
          }
          var lerp = SpinG3_1.default.lerp(from, to, fraction);
          target.setProperty(propName, lerp.coords);
        };
        Spinor3Animation.prototype.hurry = function(factor) {
          this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
        };
        Spinor3Animation.prototype.skip = function(target, propName) {
          this.duration = 0;
          this.fraction = 1;
          this.done(target, propName);
        };
        Spinor3Animation.prototype.extra = function(now) {
          return now - this.start - this.duration;
        };
        Spinor3Animation.prototype.done = function(target, propName) {
          if (this.fraction === 1) {
            target.setProperty(propName, this.to.coords);
            this.callback && this.callback();
            this.callback = void 0;
            return true;
          } else {
            return false;
          }
        };
        Spinor3Animation.prototype.undo = function(target, propName) {
          if (this.from) {
            target.setProperty(propName, this.from.coords);
            this.from = void 0;
            this.start = void 0;
            this.fraction = 0;
          }
        };
        return Spinor3Animation;
      })(Shareable_1.default);
      exports_1("default", Spinor3Animation);
    }
  };
});

System.register("davinci-eight/cameras/createFrustum.js", ["./createView", "../math/Mat4R", "../math/R1"], function(exports_1) {
  var createView_1,
      Mat4R_1,
      R1_1;
  function createFrustum(viewMatrixName, projectionMatrixName) {
    var refCount = 1;
    var base = createView_1.default(viewMatrixName);
    var left = new R1_1.default();
    var right = new R1_1.default();
    var bottom = new R1_1.default();
    var top = new R1_1.default();
    var near = new R1_1.default();
    var far = new R1_1.default();
    var projectionMatrix = Mat4R_1.default.one();
    function updateProjectionMatrix() {
      projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }
    updateProjectionMatrix();
    var self = {
      addRef: function() {
        refCount++;
        return refCount;
      },
      release: function() {
        refCount--;
        return refCount;
      },
      setProperty: function(name, value) {
        return this;
      },
      get eye() {
        return base.eye;
      },
      set eye(value) {
        base.eye = value;
      },
      setEye: function(eye) {
        base.setEye(eye);
        return self;
      },
      get look() {
        return base.look;
      },
      set look(value) {
        base.look = value;
      },
      setLook: function(look) {
        base.setLook(look);
        return self;
      },
      get up() {
        return base.up;
      },
      set up(up) {
        base.setUp(up);
      },
      setUp: function(up) {
        base.setUp(up);
        return self;
      },
      get left() {
        return left.x;
      },
      set left(value) {
        left.x = value;
        updateProjectionMatrix();
      },
      get right() {
        return right.x;
      },
      set right(value) {
        right.x = value;
        updateProjectionMatrix();
      },
      get bottom() {
        return bottom.x;
      },
      set bottom(value) {
        bottom.x = value;
        updateProjectionMatrix();
      },
      get top() {
        return top.x;
      },
      set top(value) {
        top.x = value;
        updateProjectionMatrix();
      },
      get near() {
        return near.x;
      },
      set near(value) {
        near.x = value;
        updateProjectionMatrix();
      },
      get far() {
        return far.x;
      },
      set far(value) {
        far.x = value;
        updateProjectionMatrix();
      },
      setUniforms: function(visitor) {
        visitor.mat4(projectionMatrixName, projectionMatrix, false);
        base.setUniforms(visitor);
      }
    };
    return self;
  }
  exports_1("default", createFrustum);
  return {
    setters: [function(createView_1_1) {
      createView_1 = createView_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/createView.js", ["../math/Euclidean3", "../math/R3", "../math/Mat4R", "../checks/mustBeNumber", "../checks/mustBeObject", "../core/GraphicsProgramSymbols", "../checks/isUndefined", "../cameras/viewMatrix"], function(exports_1) {
  var Euclidean3_1,
      R3_1,
      Mat4R_1,
      mustBeNumber_1,
      mustBeObject_1,
      GraphicsProgramSymbols_1,
      isUndefined_1,
      viewMatrix_1;
  function createView(options) {
    var refCount = 1;
    var eye = new R3_1.default();
    var look = new R3_1.default();
    var up = R3_1.default.copy(Euclidean3_1.default.e2);
    var viewMatrix = Mat4R_1.default.one();
    var viewMatrixName = isUndefined_1.default(options.viewMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
    eye.modified = true;
    look.modified = true;
    up.modified = true;
    var self = {
      addRef: function() {
        refCount++;
        return refCount;
      },
      release: function() {
        refCount--;
        return refCount;
      },
      setProperty: function(name, value) {
        return self;
      },
      get eye() {
        return eye;
      },
      set eye(value) {
        self.setEye(value);
      },
      setEye: function(eye_) {
        mustBeObject_1.default('eye', eye_);
        eye.x = mustBeNumber_1.default('eye.x', eye_.x);
        eye.y = mustBeNumber_1.default('eye.y', eye_.y);
        eye.z = mustBeNumber_1.default('eye.z', eye_.z);
        return self;
      },
      get look() {
        return look;
      },
      set look(value) {
        self.setLook(value);
      },
      setLook: function(value) {
        mustBeObject_1.default('look', value);
        look.x = value.x;
        look.y = value.y;
        look.z = value.z;
        return self;
      },
      get up() {
        return up;
      },
      set up(value) {
        self.setUp(value);
      },
      setUp: function(value) {
        mustBeObject_1.default('up', value);
        up.x = value.x;
        up.y = value.y;
        up.z = value.z;
        up.direction();
        return self;
      },
      setUniforms: function(visitor) {
        if (eye.modified || look.modified || up.modified) {
          viewMatrix_1.default(eye, look, up, viewMatrix);
          eye.modified = false;
          look.modified = false;
          up.modified = false;
        }
        visitor.mat4(viewMatrixName, viewMatrix, false);
      }
    };
    return self;
  }
  exports_1("default", createView);
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(viewMatrix_1_1) {
      viewMatrix_1 = viewMatrix_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/createPerspective.js", ["../cameras/createView", "../math/Mat4R", "../core/GraphicsProgramSymbols", "../math/R1", "../checks/isUndefined", "../checks/mustBeNumber", "../cameras/perspectiveMatrix"], function(exports_1) {
  var createView_1,
      Mat4R_1,
      GraphicsProgramSymbols_1,
      R1_1,
      isUndefined_1,
      mustBeNumber_1,
      perspectiveMatrix_1;
  function createPerspective(options) {
    options = options || {};
    var fov = new R1_1.default([isUndefined_1.default(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    var aspect = new R1_1.default([isUndefined_1.default(options.aspect) ? 1 : options.aspect]);
    var near = new R1_1.default([isUndefined_1.default(options.near) ? 0.1 : options.near]);
    var far = new R1_1.default([mustBeNumber_1.default('options.far', isUndefined_1.default(options.far) ? 2000 : options.far)]);
    var projectionMatrixName = isUndefined_1.default(options.projectionMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
    var refCount = 1;
    var base = createView_1.default(options);
    var projectionMatrix = Mat4R_1.default.one();
    var matrixNeedsUpdate = true;
    var self = {
      addRef: function() {
        refCount++;
        return refCount;
      },
      release: function() {
        refCount--;
        return refCount;
      },
      setProperty: function(name, value) {
        return self;
      },
      get eye() {
        return base.eye;
      },
      set eye(eye) {
        base.eye = eye;
      },
      setEye: function(eye) {
        base.setEye(eye);
        return self;
      },
      get look() {
        return base.look;
      },
      set look(value) {
        base.look = value;
      },
      setLook: function(look) {
        base.setLook(look);
        return self;
      },
      get up() {
        return base.up;
      },
      set up(value) {
        base.up = value;
      },
      setUp: function(up) {
        base.setUp(up);
        return self;
      },
      get fov() {
        return fov.x;
      },
      set fov(value) {
        self.setFov(value);
      },
      setFov: function(value) {
        mustBeNumber_1.default('fov', value);
        matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
        fov.x = value;
        return self;
      },
      get aspect() {
        return aspect.x;
      },
      set aspect(value) {
        self.setAspect(value);
      },
      setAspect: function(value) {
        mustBeNumber_1.default('aspect', value);
        matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
        aspect.x = value;
        return self;
      },
      get near() {
        return near.x;
      },
      set near(value) {
        self.setNear(value);
      },
      setNear: function(value) {
        if (value !== near.x) {
          near.x = value;
          matrixNeedsUpdate = true;
        }
        return self;
      },
      get far() {
        return far.x;
      },
      set far(value) {
        self.setFar(value);
      },
      setFar: function(value) {
        if (value !== far.x) {
          far.x = value;
          matrixNeedsUpdate = true;
        }
        return self;
      },
      setUniforms: function(visitor) {
        if (matrixNeedsUpdate) {
          perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
          matrixNeedsUpdate = false;
        }
        visitor.mat4(projectionMatrixName, projectionMatrix, false);
        base.setUniforms(visitor);
      }
    };
    return self;
  }
  exports_1("default", createPerspective);
  return {
    setters: [function(createView_1_1) {
      createView_1 = createView_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(perspectiveMatrix_1_1) {
      perspectiveMatrix_1 = perspectiveMatrix_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/PerspectiveCamera.js", ["../cameras/createPerspective", "../i18n/readOnly", "../checks/mustBeObject", "../checks/mustBeNumber", "../checks/mustBeString", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var createPerspective_1,
      readOnly_1,
      mustBeObject_1,
      mustBeNumber_1,
      mustBeString_1,
      Shareable_1;
  var PerspectiveCamera;
  return {
    setters: [function(createPerspective_1_1) {
      createPerspective_1 = createPerspective_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      PerspectiveCamera = (function(_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, aspect, near, far) {
          if (fov === void 0) {
            fov = 45 * Math.PI / 180;
          }
          if (aspect === void 0) {
            aspect = 1;
          }
          if (near === void 0) {
            near = 0.1;
          }
          if (far === void 0) {
            far = 2000;
          }
          _super.call(this, 'PerspectiveCamera');
          mustBeNumber_1.default('fov', fov);
          mustBeNumber_1.default('aspect', aspect);
          mustBeNumber_1.default('near', near);
          mustBeNumber_1.default('far', far);
          this.inner = createPerspective_1.default({
            fov: fov,
            aspect: aspect,
            near: near,
            far: far
          });
        }
        PerspectiveCamera.prototype.destructor = function() {};
        PerspectiveCamera.prototype.setUniforms = function(visitor) {
          this.inner.setNear(this.near);
          this.inner.setFar(this.far);
          this.inner.setUniforms(visitor);
        };
        PerspectiveCamera.prototype.contextFree = function(manager) {};
        PerspectiveCamera.prototype.contextGain = function(manager) {};
        PerspectiveCamera.prototype.contextLost = function() {};
        PerspectiveCamera.prototype.draw = function() {};
        PerspectiveCamera.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION:
              {
                return this.eye.coords;
              }
              break;
            default:
              {}
          }
        };
        PerspectiveCamera.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeObject_1.default('value', value);
          switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION:
              {
                this.eye.copyCoordinates(value);
              }
              break;
            default:
              {}
          }
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
          get: function() {
            return this.inner.aspect;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setAspect = function(aspect) {
          this.inner.aspect = aspect;
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
          get: function() {
            return this.inner.eye;
          },
          set: function(eye) {
            this.inner.eye.copy(eye);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setEye = function(eye) {
          this.inner.setEye(eye);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
          get: function() {
            return this.inner.fov;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('fov').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setFov = function(fov) {
          mustBeNumber_1.default('fov', fov);
          this.inner.fov = fov;
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
          get: function() {
            return this.inner.look;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setLook = function(look) {
          this.inner.setLook(look);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
          get: function() {
            return this.inner.near;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('near').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setNear = function(near) {
          this.inner.setNear(near);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "far", {
          get: function() {
            return this.inner.far;
          },
          set: function(far) {
            this.inner.far = far;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setFar = function(far) {
          this.inner.setFar(far);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "up", {
          get: function() {
            return this.inner.up;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('up').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setUp = function(up) {
          this.inner.setUp(up);
          return this;
        };
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
      })(Shareable_1.default);
      exports_1("default", PerspectiveCamera);
    }
  };
});

System.register("davinci-eight/cameras/frustumMatrix.js", ["../checks/expectArg", "../checks/isDefined"], function(exports_1) {
  var expectArg_1,
      isDefined_1;
  function frustumMatrix(left, right, bottom, top, near, far, matrix) {
    expectArg_1.default('left', left).toBeNumber();
    expectArg_1.default('right', right).toBeNumber();
    expectArg_1.default('bottom', bottom).toBeNumber();
    expectArg_1.default('top', top).toBeNumber();
    expectArg_1.default('near', near).toBeNumber();
    expectArg_1.default('far', far).toBeNumber();
    var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expectArg_1.default('m', m).toSatisfy(m.length === 16, 'elements must have length 16');
    var x = 2 * near / (right - left);
    var y = 2 * near / (top - bottom);
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = -(far + near) / (far - near);
    var d = -2 * far * near / (far - near);
    m[0x0] = x;
    m[0x4] = 0;
    m[0x8] = a;
    m[0xC] = 0;
    m[0x1] = 0;
    m[0x5] = y;
    m[0x9] = b;
    m[0xD] = 0;
    m[0x2] = 0;
    m[0x6] = 0;
    m[0xA] = c;
    m[0xE] = d;
    m[0x3] = 0;
    m[0x7] = 0;
    m[0xB] = -1;
    m[0xF] = 0;
    return m;
  }
  exports_1("default", frustumMatrix);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/perspectiveArray.js", ["../cameras/frustumMatrix", "../checks/expectArg"], function(exports_1) {
  var frustumMatrix_1,
      expectArg_1;
  function perspectiveArray(fov, aspect, near, far, matrix) {
    expectArg_1.default('fov', fov).toBeNumber();
    expectArg_1.default('aspect', aspect).toBeNumber();
    expectArg_1.default('near', near).toBeNumber();
    expectArg_1.default('far', far).toBeNumber();
    var ymax = near * Math.tan(fov * 0.5);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;
    return frustumMatrix_1.default(xmin, xmax, ymin, ymax, near, far, matrix);
  }
  exports_1("default", perspectiveArray);
  return {
    setters: [function(frustumMatrix_1_1) {
      frustumMatrix_1 = frustumMatrix_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/perspectiveMatrix.js", ["../checks/isDefined", "../math/Mat4R", "../cameras/perspectiveArray"], function(exports_1) {
  var isDefined_1,
      Mat4R_1,
      perspectiveArray_1;
  function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : Mat4R_1.default.one();
    perspectiveArray_1.default(fov, aspect, near, far, m.elements);
    return m;
  }
  exports_1("default", perspectiveMatrix);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(perspectiveArray_1_1) {
      perspectiveArray_1 = perspectiveArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/viewArray.js", ["../math/R3", "../checks/expectArg", "../checks/isDefined"], function(exports_1) {
  var R3_1,
      expectArg_1,
      isDefined_1;
  function viewArray(eye, look, up, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expectArg_1.default('matrix', m).toSatisfy(m.length === 16, 'matrix must have length 16');
    var n = new R3_1.default().sub2(eye, look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
      n.z = 1;
    } else {
      n.direction();
    }
    var u = new R3_1.default().cross2(up, n);
    var v = new R3_1.default().cross2(n, u);
    var d = new R3_1.default([R3_1.default.dot(eye, u), R3_1.default.dot(eye, v), R3_1.default.dot(eye, n)]).scale(-1);
    m[0] = u.x;
    m[4] = u.y;
    m[8] = u.z;
    m[12] = d.x;
    m[1] = v.x;
    m[5] = v.y;
    m[9] = v.z;
    m[13] = d.y;
    m[2] = n.x;
    m[6] = n.y;
    m[10] = n.z;
    m[14] = d.z;
    m[3] = 0;
    m[7] = 0;
    m[11] = 0;
    m[15] = 1;
    return m;
  }
  exports_1("default", viewArray);
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/cameras/viewMatrix.js", ["../checks/isDefined", "../math/Mat4R", "../cameras/viewArray"], function(exports_1) {
  var isDefined_1,
      Mat4R_1,
      viewArray_1;
  function viewMatrix(eye, look, up, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : Mat4R_1.default.one();
    viewArray_1.default(eye, look, up, m.elements);
    return m;
  }
  exports_1("default", viewMatrix);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(viewArray_1_1) {
      viewArray_1 = viewArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/commands/BlendFactor.js", [], function(exports_1) {
  var BlendFactor;
  return {
    setters: [],
    execute: function() {
      (function(BlendFactor) {
        BlendFactor[BlendFactor["DST_ALPHA"] = 0] = "DST_ALPHA";
        BlendFactor[BlendFactor["DST_COLOR"] = 1] = "DST_COLOR";
        BlendFactor[BlendFactor["ONE"] = 2] = "ONE";
        BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 3] = "ONE_MINUS_DST_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 4] = "ONE_MINUS_DST_COLOR";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 5] = "ONE_MINUS_SRC_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 6] = "ONE_MINUS_SRC_COLOR";
        BlendFactor[BlendFactor["SRC_ALPHA"] = 7] = "SRC_ALPHA";
        BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 8] = "SRC_ALPHA_SATURATE";
        BlendFactor[BlendFactor["SRC_COLOR"] = 9] = "SRC_COLOR";
        BlendFactor[BlendFactor["ZERO"] = 10] = "ZERO";
      })(BlendFactor || (BlendFactor = {}));
      exports_1("default", BlendFactor);
    }
  };
});

System.register("davinci-eight/commands/WebGLBlendFunc.js", ["../commands/BlendFactor", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var BlendFactor_1,
      Shareable_1;
  var factors,
      WebGLBlendFunc;
  function mustBeFactor(name, factor) {
    if (factors.indexOf(factor) >= 0) {
      return factor;
    } else {
      throw new Error(factor + " is not a valid factor.");
    }
  }
  function factor(factor, gl) {
    switch (factor) {
      case BlendFactor_1.default.ONE:
        return gl.ONE;
      case BlendFactor_1.default.SRC_ALPHA:
        return gl.SRC_ALPHA;
      default:
        {
          throw new Error(factor + " is not a valid factor.");
        }
    }
  }
  return {
    setters: [function(BlendFactor_1_1) {
      BlendFactor_1 = BlendFactor_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      factors = [BlendFactor_1.default.DST_ALPHA, BlendFactor_1.default.DST_COLOR, BlendFactor_1.default.ONE, BlendFactor_1.default.ONE_MINUS_DST_ALPHA, BlendFactor_1.default.ONE_MINUS_DST_COLOR, BlendFactor_1.default.ONE_MINUS_SRC_ALPHA, BlendFactor_1.default.ONE_MINUS_SRC_COLOR, BlendFactor_1.default.SRC_ALPHA, BlendFactor_1.default.SRC_ALPHA_SATURATE, BlendFactor_1.default.SRC_COLOR, BlendFactor_1.default.ZERO];
      WebGLBlendFunc = (function(_super) {
        __extends(WebGLBlendFunc, _super);
        function WebGLBlendFunc(sfactor, dfactor) {
          _super.call(this, 'WebGLBlendFunc');
          this.sfactor = mustBeFactor('sfactor', sfactor);
          this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        WebGLBlendFunc.prototype.contextFree = function(manager) {};
        WebGLBlendFunc.prototype.contextGain = function(manager) {
          this.execute(manager.gl);
        };
        WebGLBlendFunc.prototype.contextLost = function() {};
        WebGLBlendFunc.prototype.execute = function(gl) {
          gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
        };
        WebGLBlendFunc.prototype.destructor = function() {
          this.sfactor = void 0;
          this.dfactor = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLBlendFunc;
      })(Shareable_1.default);
      exports_1("default", WebGLBlendFunc);
    }
  };
});

System.register("davinci-eight/curves/Curve.js", [], function(exports_1) {
  var Curve;
  return {
    setters: [],
    execute: function() {
      Curve = (function() {
        function Curve() {}
        Curve.prototype.getPoint = function(t) {
          throw new Error("Curve.getPoint() not implemented!");
        };
        Curve.prototype.getPointAt = function(u) {
          var t = this.getUtoTmapping(u);
          return this.getPoint(t);
        };
        Curve.prototype.getPoints = function(divisions) {
          if (!divisions) {
            divisions = 5;
          }
          var d;
          var pts = [];
          for (d = 0; d <= divisions; d++) {
            pts.push(this.getPoint(d / divisions));
          }
          return pts;
        };
        Curve.prototype.getSpacedPoints = function(divisions) {
          if (!divisions) {
            divisions = 5;
          }
          var d;
          var pts = [];
          for (d = 0; d <= divisions; d++) {
            pts.push(this.getPointAt(d / divisions));
          }
          return pts;
        };
        Curve.prototype.getLength = function() {
          var lengths = this.getLengths();
          return lengths[lengths.length - 1];
        };
        Curve.prototype.getLengths = function(divisions) {
          if (!divisions)
            divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;
          if (this.cacheArcLengths && (this.cacheArcLengths.length == divisions + 1) && !this.needsUpdate) {
            return this.cacheArcLengths;
          }
          this.needsUpdate = false;
          var cache = [];
          var current;
          var last = this.getPoint(0);
          var p;
          var sum = 0;
          cache.push(0);
          for (p = 1; p <= divisions; p++) {
            current = this.getPoint(p / divisions);
            sum += current.distanceTo(last);
            cache.push(sum);
            last = current;
          }
          this.cacheArcLengths = cache;
          return cache;
        };
        Curve.prototype.updateArcLengths = function() {
          this.needsUpdate = true;
          this.getLengths();
        };
        Curve.prototype.getUtoTmapping = function(u, distance) {
          var arcLengths = this.getLengths();
          var i = 0,
              il = arcLengths.length;
          var targetArcLength;
          if (distance) {
            targetArcLength = distance;
          } else {
            targetArcLength = u * arcLengths[il - 1];
          }
          var low = 0;
          var high = il - 1;
          var comparison;
          while (low <= high) {
            i = Math.floor(low + (high - low) / 2);
            comparison = arcLengths[i] - targetArcLength;
            if (comparison < 0) {
              low = i + 1;
            } else if (comparison > 0) {
              high = i - 1;
            } else {
              high = i;
              break;
            }
          }
          i = high;
          if (arcLengths[i] == targetArcLength) {
            var t = i / (il - 1);
            return t;
          }
          var lengthBefore = arcLengths[i];
          var lengthAfter = arcLengths[i + 1];
          var segmentLength = lengthAfter - lengthBefore;
          var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
          var t = (i + segmentFraction) / (il - 1);
          return t;
        };
        Curve.prototype.getTangent = function(t) {
          var delta = 0.0001;
          var t1 = t - delta;
          var t2 = t + delta;
          if (t1 < 0)
            t1 = 0;
          if (t2 > 1)
            t2 = 1;
          var pt1 = this.getPoint(t1);
          var pt2 = this.getPoint(t2);
          var tangent = pt2.sub(pt1);
          return tangent.direction();
        };
        Curve.prototype.getTangentAt = function(u) {
          var t = this.getUtoTmapping(u);
          return this.getTangent(t);
        };
        return Curve;
      })();
      exports_1("default", Curve);
    }
  };
});

System.register("davinci-eight/devices/Keyboard.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var Keyboard;
  function makeKeyDownHandler(keyboard, handler) {
    return function(event) {
      keyboard.currentlyPressedKeys[event.keyCode] = true;
      handler.keyDown(event);
    };
  }
  function makeKeyUpHandler(keyboard, handler) {
    return function(event) {
      keyboard.currentlyPressedKeys[event.keyCode] = false;
      handler.keyUp(event);
    };
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      Keyboard = (function(_super) {
        __extends(Keyboard, _super);
        function Keyboard(handler, document) {
          if (document === void 0) {
            document = window.document;
          }
          _super.call(this, 'Keyboard');
          this.currentlyPressedKeys = [];
          this.attach(handler, document);
        }
        Keyboard.prototype.destructor = function() {
          this.detach();
          _super.prototype.destructor.call(this);
        };
        Keyboard.prototype.attach = function(handler, document, useCapture) {
          if (document === void 0) {
            document = window.document;
          }
          if (this.document !== document) {
            this.detach();
            this.handler = handler;
            this.handler.addRef();
            this.document = document;
            this.useCapture = useCapture;
            this.keyDownHandler = makeKeyDownHandler(this, handler);
            this.keyUpHandler = makeKeyUpHandler(this, handler);
            this.document.addEventListener('keydown', this.keyDownHandler, useCapture);
            this.document.addEventListener('keyup', this.keyUpHandler, useCapture);
          }
        };
        Keyboard.prototype.detach = function() {
          if (this.document) {
            this.document.removeEventListener('keydown', this.keyDownHandler, this.useCapture);
            this.document.removeEventListener('keyup', this.keyUpHandler, this.useCapture);
            this.handler.release();
            this.handler = void 0;
            this.document = void 0;
            this.useCapture = void 0;
            this.keyDownHandler = void 0;
            this.keyUpHandler = void 0;
          }
        };
        return Keyboard;
      })(Shareable_1.default);
      exports_1("default", Keyboard);
    }
  };
});

System.register("davinci-eight/geometries/cube.js", ["../geometries/quadrilateral", "../core/GraphicsProgramSymbols", "../math/R2", "../math/R3"], function(exports_1) {
  var quadrilateral_1,
      GraphicsProgramSymbols_1,
      R2_1,
      R3_1;
  function vector3(data) {
    return new R3_1.default([]);
  }
  function cube(size) {
    if (size === void 0) {
      size = 1;
    }
    var s = size / 2;
    var vec0 = new R3_1.default([+s, +s, +s]);
    var vec1 = new R3_1.default([-s, +s, +s]);
    var vec2 = new R3_1.default([-s, -s, +s]);
    var vec3 = new R3_1.default([+s, -s, +s]);
    var vec4 = new R3_1.default([+s, -s, -s]);
    var vec5 = new R3_1.default([+s, +s, -s]);
    var vec6 = new R3_1.default([-s, +s, -s]);
    var vec7 = new R3_1.default([-s, -s, -s]);
    var c00 = new R2_1.default([0, 0]);
    var c01 = new R2_1.default([0, 1]);
    var c10 = new R2_1.default([1, 0]);
    var c11 = new R2_1.default([1, 1]);
    var attributes = {};
    attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = [c11, c01, c00, c10];
    var front = quadrilateral_1.default(vec0, vec1, vec2, vec3, attributes);
    var right = quadrilateral_1.default(vec0, vec3, vec4, vec5, attributes);
    var top = quadrilateral_1.default(vec0, vec5, vec6, vec1, attributes);
    var left = quadrilateral_1.default(vec1, vec6, vec7, vec2, attributes);
    var bottom = quadrilateral_1.default(vec7, vec4, vec3, vec2, attributes);
    var back = quadrilateral_1.default(vec4, vec7, vec6, vec5, attributes);
    var squares = [front, right, top, left, bottom, back];
    return squares.reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }
  exports_1("default", cube);
  return {
    setters: [function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/square.js", ["../geometries/quadrilateral", "../core/GraphicsProgramSymbols", "../math/R2", "../math/R3"], function(exports_1) {
  var quadrilateral_1,
      GraphicsProgramSymbols_1,
      R2_1,
      R3_1;
  function square(size) {
    if (size === void 0) {
      size = 1;
    }
    var s = size / 2;
    var vec0 = new R3_1.default([+s, +s, 0]);
    var vec1 = new R3_1.default([-s, +s, 0]);
    var vec2 = new R3_1.default([-s, -s, 0]);
    var vec3 = new R3_1.default([+s, -s, 0]);
    var c00 = new R2_1.default([0, 0]);
    var c01 = new R2_1.default([0, 1]);
    var c10 = new R2_1.default([1, 0]);
    var c11 = new R2_1.default([1, 1]);
    var coords = [c11, c01, c00, c10];
    var attributes = {};
    attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = coords;
    return quadrilateral_1.default(vec0, vec1, vec2, vec3, attributes);
  }
  exports_1("default", square);
  return {
    setters: [function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/tetrahedron.js", ["../checks/expectArg", "../geometries/triangle", "../math/VectorN"], function(exports_1) {
  var expectArg_1,
      triangle_1,
      VectorN_1;
  function tetrahedron(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) {
      attributes = {};
    }
    if (triangles === void 0) {
      triangles = [];
    }
    expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.default, "b must be a VectorN");
    expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.default, "c must be a VectorN");
    expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.default, "d must be a VectorN");
    var triatts = {};
    var points = [a, b, c, d];
    var faces = [];
    triangle_1.default(points[0], points[1], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.default(points[1], points[3], points[2], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.default(points[2], points[3], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    triangle_1.default(points[3], points[1], points[0], triatts, triangles);
    faces.push(triangles[triangles.length - 1]);
    return triangles;
  }
  exports_1("default", tetrahedron);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(triangle_1_1) {
      triangle_1 = triangle_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/topologies/PointTopology.js", ["../core/DrawMode", "../topologies/Topology"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var DrawMode_1,
      Topology_1;
  var PointTopology;
  return {
    setters: [function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(Topology_1_1) {
      Topology_1 = Topology_1_1;
    }],
    execute: function() {
      PointTopology = (function(_super) {
        __extends(PointTopology, _super);
        function PointTopology(numVertices) {
          _super.call(this, DrawMode_1.default.POINTS, numVertices);
        }
        return PointTopology;
      })(Topology_1.default);
      exports_1("default", PointTopology);
    }
  };
});

System.register("davinci-eight/topologies/LineTopology.js", ["../topologies/Topology"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Topology_1;
  var LineTopology;
  return {
    setters: [function(Topology_1_1) {
      Topology_1 = Topology_1_1;
    }],
    execute: function() {
      LineTopology = (function(_super) {
        __extends(LineTopology, _super);
        function LineTopology(mode, numVertices) {
          _super.call(this, mode, numVertices);
        }
        return LineTopology;
      })(Topology_1.default);
      exports_1("default", LineTopology);
    }
  };
});

System.register("davinci-eight/scene/Scene.js", ["../core", "../collections/IUnknownArray", "../checks/mustBeFunction", "../checks/mustBeObject", "../checks/mustBeString", "../core/Shareable", "../core/ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var core_1,
      IUnknownArray_1,
      mustBeFunction_1,
      mustBeObject_1,
      mustBeString_1,
      Shareable_1,
      ShareableContextListener_1;
  var ScenePart,
      Scene;
  function partsFromComposite(composite) {
    mustBeObject_1.default('composite', composite);
    var parts = new IUnknownArray_1.default();
    var buffers = composite.buffers;
    var iLen = buffers.length;
    for (var i = 0; i < iLen; i++) {
      var scenePart = new ScenePart(buffers.getWeakRef(i), composite);
      parts.pushWeakRef(scenePart);
    }
    buffers.release();
    return parts;
  }
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(mustBeFunction_1_1) {
      mustBeFunction_1 = mustBeFunction_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      ScenePart = (function(_super) {
        __extends(ScenePart, _super);
        function ScenePart(buffer, composite) {
          _super.call(this, 'ScenePart');
          this._buffer = buffer;
          this._buffer.addRef();
          this._composite = composite;
          this._composite.addRef();
        }
        ScenePart.prototype.destructor = function() {
          this._buffer.release();
          this._composite.release();
          this._buffer = void 0;
          this._composite = void 0;
          _super.prototype.destructor.call(this);
        };
        ScenePart.prototype.draw = function(ambients) {
          var program = this._composite.program;
          program.use();
          if (ambients) {
            var aLength = ambients.length;
            for (var a = 0; a < aLength; a++) {
              var ambient = ambients[a];
              ambient.setUniforms(program);
            }
          }
          this._composite.setUniforms();
          this._buffer.draw(program);
          program.release();
        };
        return ScenePart;
      })(Shareable_1.default);
      Scene = (function(_super) {
        __extends(Scene, _super);
        function Scene() {
          _super.call(this, 'Scene');
          this._composites = new IUnknownArray_1.default();
          this._parts = new IUnknownArray_1.default();
        }
        Scene.prototype.destructor = function() {
          this._composites.release();
          this._parts.release();
          _super.prototype.destructor.call(this);
        };
        Scene.prototype.add = function(composite) {
          mustBeObject_1.default('composite', composite);
          this._composites.push(composite);
          var drawParts = partsFromComposite(composite);
          var iLen = drawParts.length;
          for (var i = 0; i < iLen; i++) {
            var part = drawParts.get(i);
            this._parts.push(part);
            part.release();
          }
          drawParts.release();
        };
        Scene.prototype.containsDrawable = function(composite) {
          mustBeObject_1.default('composite', composite);
          return this._composites.indexOf(composite) >= 0;
        };
        Scene.prototype.draw = function(ambients) {
          var parts = this._parts;
          var iLen = parts.length;
          for (var i = 0; i < iLen; i++) {
            parts.getWeakRef(i).draw(ambients);
          }
        };
        Scene.prototype.findOne = function(match) {
          mustBeFunction_1.default('match', match);
          return this._composites.findOne(match);
        };
        Scene.prototype.getDrawableByName = function(name) {
          if (!core_1.default.fastPath) {
            mustBeString_1.default('name', name);
          }
          return this.findOne(function(composite) {
            return composite.name === name;
          });
        };
        Scene.prototype.getDrawablesByName = function(name) {
          mustBeString_1.default('name', name);
          var result = new IUnknownArray_1.default();
          return result;
        };
        Scene.prototype.remove = function(composite) {
          mustBeObject_1.default('composite', composite);
          throw new Error("TODO");
        };
        Scene.prototype.contextFree = function(manager) {
          for (var i = 0; i < this._composites.length; i++) {
            var composite = this._composites.getWeakRef(i);
            composite.contextFree(manager);
          }
        };
        Scene.prototype.contextGain = function(manager) {
          for (var i = 0; i < this._composites.length; i++) {
            var composite = this._composites.getWeakRef(i);
            composite.contextGain(manager);
          }
        };
        Scene.prototype.contextLost = function() {
          for (var i = 0; i < this._composites.length; i++) {
            var composite = this._composites.getWeakRef(i);
            composite.contextLost();
          }
        };
        return Scene;
      })(ShareableContextListener_1.default);
      exports_1("default", Scene);
    }
  };
});

System.register("davinci-eight/core/ShareableWebGLBuffer.js", ["../checks/mustBeBoolean", "../checks/mustBeObject", "../checks/mustBeUndefined", "./ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeBoolean_1,
      mustBeObject_1,
      mustBeUndefined_1,
      ShareableContextListener_1;
  var ShareableWebGLBuffer;
  return {
    setters: [function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeUndefined_1_1) {
      mustBeUndefined_1 = mustBeUndefined_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      ShareableWebGLBuffer = (function(_super) {
        __extends(ShareableWebGLBuffer, _super);
        function ShareableWebGLBuffer(isElements) {
          _super.call(this, 'ShareableWebGLBuffer');
          this._isElements = mustBeBoolean_1.default('isElements', isElements);
        }
        ShareableWebGLBuffer.prototype.destructor = function() {
          this._isElements = void 0;
          this._target = void 0;
          _super.prototype.destructor.call(this);
          mustBeUndefined_1.default(this._type, this._buffer);
        };
        ShareableWebGLBuffer.prototype.contextFree = function(context) {
          mustBeObject_1.default('context', context);
          if (this._buffer) {
            var gl = context.gl;
            if (gl) {
              gl.deleteBuffer(this._buffer);
            } else {
              console.error((this._type + " must leak WebGLBuffer because WebGLRenderingContext is ") + typeof gl);
            }
            this._buffer = void 0;
            this._target = void 0;
          } else {}
          _super.prototype.contextFree.call(this, context);
        };
        ShareableWebGLBuffer.prototype.contextGain = function(context) {
          mustBeObject_1.default('context', context);
          var gl = context.gl;
          if (!this._buffer) {
            this._buffer = gl.createBuffer();
            this._target = this._isElements ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
          } else {}
          _super.prototype.contextGain.call(this, context);
        };
        ShareableWebGLBuffer.prototype.contextLost = function() {
          this._buffer = void 0;
          this._target = void 0;
          _super.prototype.contextLost.call(this);
        };
        ShareableWebGLBuffer.prototype.bind = function() {
          var gl = this.gl;
          if (gl) {
            gl.bindBuffer(this._target, this._buffer);
          } else {
            console.warn(this._type + ".bind() ignored because no context.");
          }
        };
        ShareableWebGLBuffer.prototype.unbind = function() {
          var gl = this.gl;
          if (gl) {
            gl.bindBuffer(this._target, null);
          } else {
            console.warn(this._type + ".unbind() ignored because no context.");
          }
        };
        return ShareableWebGLBuffer;
      })(ShareableContextListener_1.default);
      exports_1("default", ShareableWebGLBuffer);
    }
  };
});

System.register("davinci-eight/core/ShareableWebGLTexture.js", ["../checks/mustBeUndefined", "./ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeUndefined_1,
      ShareableContextListener_1;
  var ShareableWebGLTexture;
  return {
    setters: [function(mustBeUndefined_1_1) {
      mustBeUndefined_1 = mustBeUndefined_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      ShareableWebGLTexture = (function(_super) {
        __extends(ShareableWebGLTexture, _super);
        function ShareableWebGLTexture(target) {
          _super.call(this, 'ShareableWebGLTexture');
          this._target = target;
        }
        ShareableWebGLTexture.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
          mustBeUndefined_1.default(this._type, this._texture);
        };
        ShareableWebGLTexture.prototype.contextFree = function(context) {
          if (this._texture) {
            this.gl.deleteTexture(this._texture);
            this._texture = void 0;
          }
          _super.prototype.contextFree.call(this, context);
        };
        ShareableWebGLTexture.prototype.contextGain = function(context) {
          this._texture = context.gl.createTexture();
          _super.prototype.contextGain.call(this, context);
        };
        ShareableWebGLTexture.prototype.contextLost = function() {
          this._texture = void 0;
          _super.prototype.contextLost.call(this);
        };
        ShareableWebGLTexture.prototype.bind = function() {
          if (this.gl) {
            this.gl.bindTexture(this._target, this._texture);
          } else {
            console.warn(this._type + ".bind() missing WebGL rendering context.");
          }
        };
        ShareableWebGLTexture.prototype.unbind = function() {
          if (this.gl) {
            this.gl.bindTexture(this._target, null);
          } else {
            console.warn(this._type + ".unbind() missing WebGL rendering context.");
          }
        };
        return ShareableWebGLTexture;
      })(ShareableContextListener_1.default);
      exports_1("default", ShareableWebGLTexture);
    }
  };
});

System.register("davinci-eight/commands/WebGLClearColor.js", ["../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeNumber_1,
      Shareable_1;
  var WebGLClearColor;
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLClearColor = (function(_super) {
        __extends(WebGLClearColor, _super);
        function WebGLClearColor(red, green, blue, alpha) {
          if (red === void 0) {
            red = 0;
          }
          if (green === void 0) {
            green = 0;
          }
          if (blue === void 0) {
            blue = 0;
          }
          if (alpha === void 0) {
            alpha = 1;
          }
          _super.call(this, 'WebGLClearColor');
          this.red = mustBeNumber_1.default('red', red);
          this.green = mustBeNumber_1.default('green', green);
          this.blue = mustBeNumber_1.default('blue', blue);
          this.alpha = mustBeNumber_1.default('alpha', alpha);
        }
        WebGLClearColor.prototype.destructor = function() {
          this.red = void 0;
          this.green = void 0;
          this.blue = void 0;
          this.alpha = void 0;
          _super.prototype.destructor.call(this);
        };
        WebGLClearColor.prototype.contextFree = function(manager) {};
        WebGLClearColor.prototype.contextGain = function(manager) {
          mustBeNumber_1.default('red', this.red);
          mustBeNumber_1.default('green', this.green);
          mustBeNumber_1.default('blue', this.blue);
          mustBeNumber_1.default('alpha', this.alpha);
          manager.gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        WebGLClearColor.prototype.contextLost = function() {};
        return WebGLClearColor;
      })(Shareable_1.default);
      exports_1("default", WebGLClearColor);
    }
  };
});

System.register("davinci-eight/commands/WebGLEnable.js", ["../commands/glCapability", "../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var glCapability_1,
      mustBeNumber_1,
      Shareable_1;
  var WebGLEnable;
  return {
    setters: [function(glCapability_1_1) {
      glCapability_1 = glCapability_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLEnable = (function(_super) {
        __extends(WebGLEnable, _super);
        function WebGLEnable(capability) {
          _super.call(this, 'WebGLEnable');
          this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLEnable.prototype.contextFree = function(manager) {};
        WebGLEnable.prototype.contextGain = function(manager) {
          manager.gl.enable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLEnable.prototype.contextLost = function() {};
        WebGLEnable.prototype.destructor = function() {
          this._capability = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLEnable;
      })(Shareable_1.default);
      exports_1("default", WebGLEnable);
    }
  };
});

System.register("davinci-eight/commands/Capability.js", [], function(exports_1) {
  var Capability;
  return {
    setters: [],
    execute: function() {
      (function(Capability) {
        Capability[Capability["BLEND"] = 0] = "BLEND";
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
      })(Capability || (Capability = {}));
      exports_1("default", Capability);
    }
  };
});

System.register("davinci-eight/commands/glCapability.js", ["../commands/Capability", "../checks/isDefined", "../checks/mustBeDefined", "../checks/mustBeInteger"], function(exports_1) {
  var Capability_1,
      isDefined_1,
      mustBeDefined_1,
      mustBeInteger_1;
  function glCapability(capability, gl) {
    if (isDefined_1.default(capability)) {
      mustBeInteger_1.default('capability', capability);
      mustBeDefined_1.default('gl', gl);
      switch (capability) {
        case Capability_1.default.BLEND:
          return gl.BLEND;
        case Capability_1.default.CULL_FACE:
          return gl.CULL_FACE;
        case Capability_1.default.DEPTH_TEST:
          return gl.DEPTH_TEST;
        case Capability_1.default.POLYGON_OFFSET_FILL:
          return gl.POLYGON_OFFSET_FILL;
        case Capability_1.default.SCISSOR_TEST:
          return gl.SCISSOR_TEST;
        default:
          {
            throw new Error(capability + " is not a valid capability.");
          }
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", glCapability);
  return {
    setters: [function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/commands/WebGLDisable.js", ["../commands/glCapability", "../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var glCapability_1,
      mustBeNumber_1,
      Shareable_1;
  var WebGLDisable;
  return {
    setters: [function(glCapability_1_1) {
      glCapability_1 = glCapability_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLDisable = (function(_super) {
        __extends(WebGLDisable, _super);
        function WebGLDisable(capability) {
          _super.call(this, 'WebGLDisable');
          this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLDisable.prototype.contextFree = function(manager) {};
        WebGLDisable.prototype.contextGain = function(manager) {
          manager.gl.disable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLDisable.prototype.contextLost = function() {};
        WebGLDisable.prototype.destructor = function() {
          this._capability = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLDisable;
      })(Shareable_1.default);
      exports_1("default", WebGLDisable);
    }
  };
});

System.register("davinci-eight/scene/WebGLRenderer.js", ["../commands/Capability", "../core/DrawMode", "../core", "../core/ShareableWebGLBuffer", "../collections/IUnknownArray", "./initWebGL", "../checks/isDefined", "../checks/isUndefined", "../checks/mustBeArray", "../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../checks/mustBeString", "../checks/mustSatisfy", "../i18n/readOnly", "../core/Shareable", "../collections/StringIUnknownMap", "../core/ShareableWebGLTexture", "../commands/WebGLClearColor", "../commands/WebGLEnable", "../commands/WebGLDisable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Capability_1,
      DrawMode_1,
      core_1,
      ShareableWebGLBuffer_1,
      IUnknownArray_1,
      initWebGL_1,
      isDefined_1,
      isUndefined_1,
      mustBeArray_1,
      mustBeDefined_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      mustBeString_1,
      mustSatisfy_1,
      readOnly_1,
      Shareable_1,
      StringIUnknownMap_1,
      ShareableWebGLTexture_1,
      WebGLClearColor_1,
      WebGLEnable_1,
      WebGLDisable_1;
  var DrawElementsCommand,
      ElementsBlock,
      ElementsBlockAttrib,
      BufferGeometry,
      WebGLRenderer;
  function isBufferUsage(usage) {
    mustBeNumber_1.default('usage', usage);
    switch (usage) {
      case WebGLRenderingContext.STATIC_DRAW:
        {
          return true;
        }
        break;
      default:
        {
          return false;
        }
    }
  }
  function mustBeContext(gl, method) {
    if (gl) {
      return gl;
    } else {
      throw new Error(method + ": gl: WebGLRenderingContext is not defined. Either gl has been lost or start() not called.");
    }
  }
  function messageUnrecognizedMesh(uuid) {
    mustBeString_1.default('uuid', uuid);
    return uuid + " is not a recognized mesh uuid";
  }
  function attribKey(aName, aNameToKeyName) {
    if (aNameToKeyName) {
      var key = aNameToKeyName[aName];
      return key ? key : aName;
    } else {
      return aName;
    }
  }
  function bindProgramAttribLocations(program, block, aNameToKeyName) {
    var attribLocations = program.attributes;
    if (attribLocations) {
      var aNames = Object.keys(attribLocations);
      for (var i = 0,
          iLength = aNames.length; i < iLength; i++) {
        var aName = aNames[i];
        var key = attribKey(aName, aNameToKeyName);
        var attributes = block.attributes;
        var attribute = attributes.getWeakRef(key);
        if (attribute) {
          var buffer = attribute.buffer;
          buffer.bind();
          var attributeLocation = attribLocations[aName];
          attributeLocation.vertexPointer(attribute.size, attribute.normalized, attribute.stride, attribute.offset);
          buffer.unbind();
          attributeLocation.enable();
          buffer.release();
        } else {
          console.warn("program attribute " + aName + " is not satisfied by the mesh");
        }
        attributes.release();
      }
    } else {
      console.warn("program.attributes is falsey.");
    }
  }
  function unbindProgramAttribLocations(program) {
    var attribLocations = program.attributes;
    if (attribLocations) {
      var aNames = Object.keys(attribLocations);
      for (var i = 0,
          iLength = aNames.length; i < iLength; i++) {
        attribLocations[aNames[i]].disable();
      }
    } else {
      console.warn("program.attributes is falsey.");
    }
  }
  return {
    setters: [function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(ShareableWebGLBuffer_1_1) {
      ShareableWebGLBuffer_1 = ShareableWebGLBuffer_1_1;
    }, function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(initWebGL_1_1) {
      initWebGL_1 = initWebGL_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(StringIUnknownMap_1_1) {
      StringIUnknownMap_1 = StringIUnknownMap_1_1;
    }, function(ShareableWebGLTexture_1_1) {
      ShareableWebGLTexture_1 = ShareableWebGLTexture_1_1;
    }, function(WebGLClearColor_1_1) {
      WebGLClearColor_1 = WebGLClearColor_1_1;
    }, function(WebGLEnable_1_1) {
      WebGLEnable_1 = WebGLEnable_1_1;
    }, function(WebGLDisable_1_1) {
      WebGLDisable_1 = WebGLDisable_1_1;
    }],
    execute: function() {
      DrawElementsCommand = (function() {
        function DrawElementsCommand(mode, count, type, offset) {
          mustBeInteger_1.default('mode', mode);
          mustBeInteger_1.default('count', count);
          mustBeInteger_1.default('type', type);
          mustBeInteger_1.default('offset', offset);
          this.mode = mode;
          this.count = count;
          this.type = type;
          this.offset = offset;
        }
        DrawElementsCommand.prototype.execute = function(gl) {
          if (isDefined_1.default(gl)) {
            switch (this.mode) {
              case DrawMode_1.default.TRIANGLE_STRIP:
                gl.drawElements(gl.TRIANGLE_STRIP, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.TRIANGLE_FAN:
                gl.drawElements(gl.TRIANGLE_FAN, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.TRIANGLES:
                gl.drawElements(gl.TRIANGLES, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.LINE_STRIP:
                gl.drawElements(gl.LINE_STRIP, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.LINE_LOOP:
                gl.drawElements(gl.LINE_LOOP, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.LINES:
                gl.drawElements(gl.LINES, this.count, this.type, this.offset);
                break;
              case DrawMode_1.default.POINTS:
                gl.drawElements(gl.POINTS, this.count, this.type, this.offset);
                break;
              default:
                throw new Error("mode: " + this.mode);
            }
          }
        };
        return DrawElementsCommand;
      })();
      ElementsBlock = (function(_super) {
        __extends(ElementsBlock, _super);
        function ElementsBlock(indexBuffer, attributes, drawCommand) {
          _super.call(this, 'ElementsBlock');
          this._indexBuffer = indexBuffer;
          this._indexBuffer.addRef();
          this._attributes = attributes;
          this._attributes.addRef();
          this.drawCommand = drawCommand;
        }
        ElementsBlock.prototype.destructor = function() {
          this._attributes.release();
          this._attributes = void 0;
          this._indexBuffer.release();
          this._indexBuffer = void 0;
          _super.prototype.destructor.call(this);
        };
        ElementsBlock.prototype.contextFree = function(context) {
          this._indexBuffer.contextFree(context);
          this._attributes.forEach(function(key, attribute) {
            attribute.contextFree(context);
          });
        };
        ElementsBlock.prototype.contextGain = function(context) {
          this._indexBuffer.contextGain(context);
          this._attributes.forEach(function(key, attribute) {
            attribute.contextGain(context);
          });
        };
        ElementsBlock.prototype.contextLost = function() {
          this._indexBuffer.contextLost();
          this._attributes.forEach(function(key, attribute) {
            attribute.contextLost();
          });
        };
        ElementsBlock.prototype.bind = function() {
          this._indexBuffer.bind();
        };
        ElementsBlock.prototype.unbind = function() {
          this._indexBuffer.unbind();
        };
        Object.defineProperty(ElementsBlock.prototype, "attributes", {
          get: function() {
            this._attributes.addRef();
            return this._attributes;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('attributes').message);
          },
          enumerable: true,
          configurable: true
        });
        return ElementsBlock;
      })(Shareable_1.default);
      ElementsBlockAttrib = (function(_super) {
        __extends(ElementsBlockAttrib, _super);
        function ElementsBlockAttrib(buffer, size, normalized, stride, offset) {
          _super.call(this, 'ElementsBlockAttrib');
          this._buffer = buffer;
          this._buffer.addRef();
          this.size = size;
          this.normalized = normalized;
          this.stride = stride;
          this.offset = offset;
        }
        ElementsBlockAttrib.prototype.destructor = function() {
          this._buffer.release();
          this._buffer = void 0;
          this.size = void 0;
          this.normalized = void 0;
          this.stride = void 0;
          this.offset = void 0;
          _super.prototype.destructor.call(this);
        };
        ElementsBlockAttrib.prototype.contextFree = function(context) {
          this._buffer.contextFree(context);
        };
        ElementsBlockAttrib.prototype.contextGain = function(context) {
          this._buffer.contextGain(context);
        };
        ElementsBlockAttrib.prototype.contextLost = function() {
          this._buffer.contextLost();
        };
        Object.defineProperty(ElementsBlockAttrib.prototype, "buffer", {
          get: function() {
            this._buffer.addRef();
            return this._buffer;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('buffer').message);
          },
          enumerable: true,
          configurable: true
        });
        return ElementsBlockAttrib;
      })(Shareable_1.default);
      BufferGeometry = (function(_super) {
        __extends(BufferGeometry, _super);
        function BufferGeometry(gl, blocks) {
          _super.call(this, 'BufferGeometry');
          this._blocks = blocks;
          this._blocks.addRef();
          this.gl = gl;
        }
        BufferGeometry.prototype.destructor = function() {
          this._blocks.release();
          this._blocks = void 0;
          this.gl = void 0;
          _super.prototype.destructor.call(this);
        };
        BufferGeometry.prototype.bind = function(program, aNameToKeyName) {
          if (this._program !== program) {
            if (this._program) {
              this.unbind();
            }
            var block = this._blocks.getWeakRef(this.uuid);
            if (block) {
              if (program) {
                this._program = program;
                this._program.addRef();
                block.bind();
                bindProgramAttribLocations(this._program, block, aNameToKeyName);
              } else {
                mustBeObject_1.default('program', program);
              }
            } else {
              throw new Error(messageUnrecognizedMesh(this.uuid));
            }
          }
        };
        BufferGeometry.prototype.draw = function() {
          var block = this._blocks.getWeakRef(this.uuid);
          if (block) {
            block.drawCommand.execute(this.gl);
          } else {
            throw new Error(messageUnrecognizedMesh(this.uuid));
          }
        };
        BufferGeometry.prototype.unbind = function() {
          if (this._program) {
            var block = this._blocks.getWeakRef(this.uuid);
            if (block) {
              block.unbind();
              unbindProgramAttribLocations(this._program);
            } else {
              throw new Error(messageUnrecognizedMesh(this.uuid));
            }
            this._program.release();
            this._program = void 0;
          }
        };
        return BufferGeometry;
      })(Shareable_1.default);
      WebGLRenderer = (function(_super) {
        __extends(WebGLRenderer, _super);
        function WebGLRenderer(attributes) {
          var _this = this;
          _super.call(this, 'WebGLRenderer');
          this._blocks = new StringIUnknownMap_1.default();
          this._users = [];
          this._commands = new IUnknownArray_1.default([]);
          console.log(core_1.default.NAMESPACE + " " + this._type + " " + core_1.default.VERSION);
          this._attributes = attributes;
          this.enable(Capability_1.default.DEPTH_TEST);
          this._webGLContextLost = function(event) {
            if (isDefined_1.default(_this._canvas)) {
              event.preventDefault();
              _this._gl = void 0;
              _this._users.forEach(function(user) {
                user.contextLost();
              });
            }
          };
          this._webGLContextRestored = function(event) {
            if (isDefined_1.default(_this._canvas)) {
              event.preventDefault();
              _this._gl = initWebGL_1.default(_this._canvas, attributes);
              _this._users.forEach(function(user) {
                user.contextGain(_this);
              });
            }
          };
        }
        WebGLRenderer.prototype.destructor = function() {
          this.stop();
          this._blocks.release();
          while (this._users.length > 0) {
            this._users.pop();
          }
          this._commands.release();
          _super.prototype.destructor.call(this);
        };
        WebGLRenderer.prototype.addContextListener = function(user) {
          mustBeObject_1.default('user', user);
          var index = this._users.indexOf(user);
          if (index < 0) {
            this._users.push(user);
          } else {
            console.warn("user already exists for addContextListener");
          }
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvas", {
          get: function() {
            if (!this._canvas) {
              this.start(document.createElement('canvas'));
            }
            return this._canvas;
          },
          set: function(canvas) {
            throw new Error(readOnly_1.default('canvas').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "commands", {
          get: function() {
            this._commands.addRef();
            return this._commands;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('commands').message);
          },
          enumerable: true,
          configurable: true
        });
        WebGLRenderer.prototype.clearColor = function(red, green, blue, alpha) {
          this._commands.pushWeakRef(new WebGLClearColor_1.default(red, green, blue, alpha));
          return this;
        };
        WebGLRenderer.prototype.contextFree = function(manager) {
          this._commands.forEach(function(command) {
            command.contextFree(manager);
          });
        };
        WebGLRenderer.prototype.contextGain = function(manager) {
          this._commands.forEach(function(command) {
            command.contextGain(manager);
          });
        };
        WebGLRenderer.prototype.contextLost = function() {
          this._commands.forEach(function(command) {
            command.contextLost();
          });
        };
        WebGLRenderer.prototype.createArrayBuffer = function() {
          return new ShareableWebGLBuffer_1.default(false);
        };
        WebGLRenderer.prototype.createBufferGeometry = function(primitive, usage) {
          var _this = this;
          mustBeObject_1.default('primitive', primitive);
          mustBeInteger_1.default('primitive.mode', primitive.mode);
          mustBeArray_1.default('primitive.indices', primitive.indices);
          mustBeObject_1.default('primitive.attributes', primitive.attributes);
          if (isDefined_1.default(usage)) {
            mustSatisfy_1.default('usage', isBufferUsage(usage), function() {
              return _this._type + ".createBufferGeometry";
            });
          } else {
            usage = isDefined_1.default(this._gl) ? this._gl.STATIC_DRAW : void 0;
          }
          if (isUndefined_1.default(this._gl)) {
            if (core_1.default.verbose) {
              console.warn("Impossible to create a buffer geometry without a WebGL context.");
            }
            return void 0;
          }
          var mesh = new BufferGeometry(this._gl, this._blocks);
          var indexBuffer = new ShareableWebGLBuffer_1.default(true);
          this.synchronize(indexBuffer);
          indexBuffer.bind();
          if (isDefined_1.default(this._gl)) {
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(primitive.indices), usage);
          } else {
            console.warn("Unable to bufferData to ELEMENT_ARRAY_BUFFER, WebGL context is undefined.");
          }
          indexBuffer.unbind();
          var attributes = new StringIUnknownMap_1.default();
          var names = Object.keys(primitive.attributes);
          var namesLength = names.length;
          for (var i = 0; i < namesLength; i++) {
            var name_1 = names[i];
            var buffer = new ShareableWebGLBuffer_1.default(false);
            this.synchronize(buffer);
            buffer.bind();
            var vertexAttrib = primitive.attributes[name_1];
            var data = vertexAttrib.values;
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), usage);
            var attribute = new ElementsBlockAttrib(buffer, vertexAttrib.size, false, 0, 0);
            attributes.put(name_1, attribute);
            attribute.release();
            buffer.unbind();
            buffer.release();
          }
          var drawCommand = new DrawElementsCommand(primitive.mode, primitive.indices.length, this._gl.UNSIGNED_SHORT, 0);
          var block = new ElementsBlock(indexBuffer, attributes, drawCommand);
          this._blocks.put(mesh.uuid, block);
          block.release();
          attributes.release();
          indexBuffer.release();
          return mesh;
        };
        WebGLRenderer.prototype.createElementArrayBuffer = function() {
          return new ShareableWebGLBuffer_1.default(true);
        };
        WebGLRenderer.prototype.createTextureCubeMap = function() {
          return new ShareableWebGLTexture_1.default(mustBeContext(this._gl, 'createTextureCubeMap()').TEXTURE_CUBE_MAP);
        };
        WebGLRenderer.prototype.createTexture2D = function() {
          return new ShareableWebGLTexture_1.default(mustBeContext(this._gl, 'createTexture2D()').TEXTURE_2D);
        };
        WebGLRenderer.prototype.disable = function(capability) {
          this._commands.pushWeakRef(new WebGLDisable_1.default(capability));
          return this;
        };
        WebGLRenderer.prototype.enable = function(capability) {
          this._commands.pushWeakRef(new WebGLEnable_1.default(capability));
          return this;
        };
        Object.defineProperty(WebGLRenderer.prototype, "gl", {
          get: function() {
            if (this._gl) {
              return this._gl;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('gl').message);
          },
          enumerable: true,
          configurable: true
        });
        WebGLRenderer.prototype.removeContextListener = function(user) {
          mustBeObject_1.default('user', user);
          var index = this._users.indexOf(user);
          if (index >= 0) {
            this._users.splice(index, 1);
          }
        };
        WebGLRenderer.prototype.prolog = function() {
          var gl = this._gl;
          if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          }
        };
        WebGLRenderer.prototype.render = function(drawList, ambients) {
          var gl = this._gl;
          if (gl) {
            return drawList.draw(ambients);
          }
        };
        WebGLRenderer.prototype.viewport = function(x, y, width, height) {
          this._gl.viewport(x, y, width, height);
          return this;
        };
        WebGLRenderer.prototype.start = function(canvas) {
          if (!(canvas instanceof HTMLCanvasElement)) {
            console.warn("canvas must be an HTMLCanvasElement to start the context.");
            return this;
          }
          mustBeDefined_1.default('canvas', canvas);
          var alreadyStarted = isDefined_1.default(this._canvas);
          if (!alreadyStarted) {
            this._canvas = canvas;
          } else {
            if (core_1.default.verbose) {
              console.warn(this._type + " Ignoring start() because already started.");
            }
            return;
          }
          if (isDefined_1.default(this._canvas)) {
            this._gl = initWebGL_1.default(this._canvas, this._attributes);
            this.emitStartEvent();
            this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
            this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
          }
          return this;
        };
        WebGLRenderer.prototype.stop = function() {
          if (isDefined_1.default(this._canvas)) {
            this._canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
            this._canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
            if (this._gl) {
              this.emitStopEvent();
              this._gl = void 0;
            }
            this._canvas = void 0;
          }
          return this;
        };
        WebGLRenderer.prototype.emitStartEvent = function() {
          var _this = this;
          this._blocks.forEach(function(key, block) {
            _this.emitContextGain(block);
          });
          this._users.forEach(function(user) {
            _this.emitContextGain(user);
          });
          this._commands.forEach(function(command) {
            _this.emitContextGain(command);
          });
        };
        WebGLRenderer.prototype.emitContextGain = function(consumer) {
          if (this._gl.isContextLost()) {
            consumer.contextLost();
          } else {
            consumer.contextGain(this);
          }
        };
        WebGLRenderer.prototype.emitStopEvent = function() {
          var _this = this;
          this._blocks.forEach(function(key, block) {
            _this.emitContextFree(block);
          });
          this._users.forEach(function(user) {
            _this.emitContextFree(user);
          });
          this._commands.forEach(function(command) {
            _this.emitContextFree(command);
          });
        };
        WebGLRenderer.prototype.emitContextFree = function(consumer) {
          if (this._gl.isContextLost()) {
            consumer.contextLost();
          } else {
            consumer.contextFree(this);
          }
        };
        WebGLRenderer.prototype.synchronize = function(consumer) {
          if (this._gl) {
            this.emitContextGain(consumer);
          } else {}
        };
        return WebGLRenderer;
      })(Shareable_1.default);
      exports_1("default", WebGLRenderer);
    }
  };
});

System.register("davinci-eight/geometries/BarnSimplexGeometry.js", ["../geometries/computeFaceNormals", "../math/Euclidean3", "../geometries/SimplexGeometry", "../geometries/quadrilateral", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../geometries/triangle", "../math/G3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var computeFaceNormals_1,
      Euclidean3_1,
      SimplexGeometry_1,
      quadrilateral_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      triangle_1,
      G3_1;
  var BarnSimplexGeometry;
  return {
    setters: [function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(triangle_1_1) {
      triangle_1 = triangle_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }],
    execute: function() {
      BarnSimplexGeometry = (function(_super) {
        __extends(BarnSimplexGeometry, _super);
        function BarnSimplexGeometry() {
          _super.call(this);
          this.a = G3_1.default.fromVector(Euclidean3_1.default.e1);
          this.b = G3_1.default.fromVector(Euclidean3_1.default.e2);
          this.c = G3_1.default.fromVector(Euclidean3_1.default.e3);
          this.regenerate();
        }
        BarnSimplexGeometry.prototype.isModified = function() {
          return this.a.modified || this.b.modified || this.c.modified || _super.prototype.isModified.call(this);
        };
        BarnSimplexGeometry.prototype.setModified = function(modified) {
          this.a.modified = modified;
          this.b.modified = modified;
          this.c.modified = modified;
          _super.prototype.setModified.call(this, modified);
          return this;
        };
        BarnSimplexGeometry.prototype.regenerate = function() {
          this.setModified(false);
          var points = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(index) {
            return void 0;
          });
          points[0] = new G3_1.default().sub(this.a).sub(this.b).sub(this.c).divByScalar(2);
          points[1] = new G3_1.default().add(this.a).sub(this.b).sub(this.c).divByScalar(2);
          points[6] = new G3_1.default().add(this.a).sub(this.b).add(this.c).divByScalar(2);
          points[5] = new G3_1.default().sub(this.a).sub(this.b).add(this.c).divByScalar(2);
          points[4] = new G3_1.default().copy(points[0]).add(this.b);
          points[2] = new G3_1.default().copy(points[1]).add(this.b);
          points[7] = new G3_1.default().copy(points[6]).add(this.b);
          points[9] = new G3_1.default().copy(points[5]).add(this.b);
          points[3] = G3_1.default.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divByScalar(2);
          points[8] = G3_1.default.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divByScalar(2);
          var position = G3_1.default.fromVector(this.position);
          points = points.map(function(point) {
            return point.add(position);
          });
          function simplex(indices) {
            var simplex = new Simplex_1.default(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[indices[i]];
            }
            return simplex;
          }
          switch (this.k) {
            case 0:
              {
                var simplices = points.map(function(point) {
                  var simplex = new Simplex_1.default(0);
                  simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = point;
                  return simplex;
                });
                this.data = simplices;
              }
              break;
            case 1:
              {
                var lines = [[0, 1], [1, 6], [6, 5], [5, 0], [1, 2], [6, 7], [5, 9], [0, 4], [4, 3], [3, 2], [9, 8], [8, 7], [9, 4], [8, 3], [7, 2]];
                this.data = lines.map(function(line) {
                  return simplex(line);
                });
              }
              break;
            case 2:
              {
                var faces = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(index) {
                  return void 0;
                });
                faces[0] = quadrilateral_1.default(points[0], points[5], points[9], points[4]);
                faces[1] = quadrilateral_1.default(points[3], points[4], points[9], points[8]);
                faces[2] = quadrilateral_1.default(points[2], points[3], points[8], points[7]);
                faces[3] = quadrilateral_1.default(points[1], points[2], points[7], points[6]);
                faces[4] = quadrilateral_1.default(points[0], points[1], points[6], points[5]);
                faces[5] = quadrilateral_1.default(points[5], points[6], points[7], points[9]);
                faces[6] = quadrilateral_1.default(points[0], points[4], points[2], points[1]);
                faces[7] = triangle_1.default(points[9], points[7], points[8]);
                faces[8] = triangle_1.default(points[2], points[4], points[3]);
                this.data = faces.reduce(function(a, b) {
                  return a.concat(b);
                }, []);
                this.data.forEach(function(simplex) {
                  computeFaceNormals_1.default(simplex);
                });
              }
              break;
            default:
              {}
          }
          this.check();
        };
        return BarnSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", BarnSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/ConeSimplexGeometry.js", ["../math/Euclidean3", "../geometries/SliceSimplexGeometry", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Euclidean3_1,
      SliceSimplexGeometry_1,
      R2_1,
      R3_1;
  var ConeSimplexGeometry;
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(SliceSimplexGeometry_1_1) {
      SliceSimplexGeometry_1 = SliceSimplexGeometry_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      ConeSimplexGeometry = (function(_super) {
        __extends(ConeSimplexGeometry, _super);
        function ConeSimplexGeometry(radius, height, axis, radiusTop, openTop, openBottom, thetaStart) {
          if (radius === void 0) {
            radius = 0.5;
          }
          if (height === void 0) {
            height = 1;
          }
          if (radiusTop === void 0) {
            radiusTop = 0.0;
          }
          if (openTop === void 0) {
            openTop = false;
          }
          if (openBottom === void 0) {
            openBottom = false;
          }
          if (thetaStart === void 0) {
            thetaStart = 0;
          }
          _super.call(this, axis, void 0, void 0);
          this.radiusTop = radiusTop;
          this.radius = radius;
          this.height = height;
          this.openTop = openTop;
          this.openBottom = openBottom;
          this.thetaStart = thetaStart;
        }
        ConeSimplexGeometry.prototype.regenerate = function() {
          var radiusBottom = this.radius;
          var radiusTop = this.radiusTop;
          var height = this.height;
          var heightSegments = this.flatSegments;
          var radialSegments = this.curvedSegments;
          var openTop = this.openTop;
          var openBottom = this.openBottom;
          var thetaStart = this.thetaStart;
          var sliceAngle = this.sliceAngle;
          var heightHalf = height / 2;
          var x;
          var y;
          var points = [];
          var vertices = [];
          var uvs = [];
          for (y = 0; y <= heightSegments; y++) {
            var verticesRow = [];
            var uvsRow = [];
            var v = y / heightSegments;
            var radius = v * (radiusBottom - radiusTop) + radiusTop;
            for (x = 0; x <= radialSegments; x++) {
              var u = x / radialSegments;
              var vertex = new R3_1.default();
              vertex.x = radius * Math.sin(u * sliceAngle + thetaStart);
              vertex.y = -v * height + heightHalf;
              vertex.z = radius * Math.cos(u * sliceAngle + thetaStart);
              points.push(vertex);
              verticesRow.push(points.length - 1);
              uvsRow.push(new R2_1.default([u, 1 - v]));
            }
            vertices.push(verticesRow);
            uvs.push(uvsRow);
          }
          var tanTheta = (radiusBottom - radiusTop) / height;
          var na;
          var nb;
          for (x = 0; x < radialSegments; x++) {
            if (radiusTop !== 0) {
              na = R3_1.default.copy(points[vertices[0][x]]);
              nb = R3_1.default.copy(points[vertices[0][x + 1]]);
            } else {
              na = R3_1.default.copy(points[vertices[1][x]]);
              nb = R3_1.default.copy(points[vertices[1][x + 1]]);
            }
            na.setY(Math.sqrt(na.x * na.x + na.z * na.z) * tanTheta).direction();
            nb.setY(Math.sqrt(nb.x * nb.x + nb.z * nb.z) * tanTheta).direction();
            for (y = 0; y < heightSegments; y++) {
              var v1 = vertices[y][x];
              var v2 = vertices[y + 1][x];
              var v3 = vertices[y + 1][x + 1];
              var v4 = vertices[y][x + 1];
              var n1 = na.clone();
              var n2 = na.clone();
              var n3 = nb.clone();
              var n4 = nb.clone();
              var uv1 = uvs[y][x].clone();
              var uv2 = uvs[y + 1][x].clone();
              var uv3 = uvs[y + 1][x + 1].clone();
              var uv4 = uvs[y][x + 1].clone();
              this.triangle([points[v1], points[v2], points[v4]], [n1, n2, n4], [uv1, uv2, uv4]);
              this.triangle([points[v2], points[v3], points[v4]], [n2.clone(), n3, n4.clone()], [uv2.clone(), uv3, uv4.clone()]);
            }
          }
          if (!openTop && radiusTop > 0) {
            points.push(R3_1.default.copy(Euclidean3_1.default.e2).scale(heightHalf));
            for (x = 0; x < radialSegments; x++) {
              var v1 = vertices[0][x];
              var v2 = vertices[0][x + 1];
              var v3 = points.length - 1;
              var n1 = R3_1.default.copy(Euclidean3_1.default.e2);
              var n2 = R3_1.default.copy(Euclidean3_1.default.e2);
              var n3 = R3_1.default.copy(Euclidean3_1.default.e2);
              var uv1 = uvs[0][x].clone();
              var uv2 = uvs[0][x + 1].clone();
              var uv3 = new R2_1.default([uv2.x, 0]);
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
          if (!openBottom && radiusBottom > 0) {
            points.push(R3_1.default.copy(Euclidean3_1.default.e2).scale(-heightHalf));
            for (x = 0; x < radialSegments; x++) {
              var v1 = vertices[heightSegments][x + 1];
              var v2 = vertices[heightSegments][x];
              var v3 = points.length - 1;
              var n1 = R3_1.default.copy(Euclidean3_1.default.e2).scale(-1);
              var n2 = R3_1.default.copy(Euclidean3_1.default.e2).scale(-1);
              var n3 = R3_1.default.copy(Euclidean3_1.default.e2).scale(-1);
              var uv1 = uvs[heightSegments][x + 1].clone();
              var uv2 = uvs[heightSegments][x].clone();
              var uv3 = new R2_1.default([uv2.x, 1]);
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
        };
        return ConeSimplexGeometry;
      })(SliceSimplexGeometry_1.default);
      exports_1("default", ConeSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/computeFaceNormals.js", ["../core/GraphicsProgramSymbols", "../math/R3", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var GraphicsProgramSymbols_1,
      R3_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  function computeFaceNormals(simplex, positionName, normalName) {
    if (positionName === void 0) {
      positionName = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    }
    if (normalName === void 0) {
      normalName = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    }
    var vertex0 = simplex.vertices[0].attributes;
    var vertex1 = simplex.vertices[1].attributes;
    var vertex2 = simplex.vertices[2].attributes;
    var pos0 = vertex0[positionName];
    var pos1 = vertex1[positionName];
    var pos2 = vertex2[positionName];
    var x0 = pos0.getComponent(0);
    var y0 = pos0.getComponent(1);
    var z0 = pos0.getComponent(2);
    var x1 = pos1.getComponent(0);
    var y1 = pos1.getComponent(1);
    var z1 = pos1.getComponent(2);
    var x2 = pos2.getComponent(0);
    var y2 = pos2.getComponent(1);
    var z2 = pos2.getComponent(2);
    var ax = x2 - x1;
    var ay = y2 - y1;
    var az = z2 - z1;
    var bx = x0 - x1;
    var by = y0 - y1;
    var bz = z0 - z1;
    var x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
    var y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
    var z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
    var normal = new R3_1.default([x, y, z]).direction();
    vertex0[normalName] = normal;
    vertex1[normalName] = normal;
    vertex2[normalName] = normal;
  }
  exports_1("default", computeFaceNormals);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/triangle.js", ["../geometries/computeFaceNormals", "../checks/expectArg", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/VectorN"], function(exports_1) {
  var computeFaceNormals_1,
      expectArg_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      VectorN_1;
  function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) {
      attributes = {};
    }
    if (triangles === void 0) {
      triangles = [];
    }
    expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', b).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', c).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = a;
    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = b;
    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = c;
    computeFaceNormals_1.default(simplex, GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL);
    Simplex_1.default.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
  }
  exports_1("default", triangle);
  return {
    setters: [function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/quadrilateral.js", ["../checks/expectArg", "../geometries/triangle", "../math/VectorN"], function(exports_1) {
  var expectArg_1,
      triangle_1,
      VectorN_1;
  function setAttributes(which, source, target) {
    var names = Object.keys(source);
    var namesLength = names.length;
    var i;
    var name;
    var values;
    for (i = 0; i < namesLength; i++) {
      name = names[i];
      values = source[name];
      target[name] = which.map(function(index) {
        return values[index];
      });
    }
  }
  function quadrilateral(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) {
      attributes = {};
    }
    if (triangles === void 0) {
      triangles = [];
    }
    expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.default, "b must be a VectorN");
    expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.default, "c must be a VectorN");
    expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.default, "d must be a VectorN");
    var triatts = {};
    setAttributes([1, 2, 0], attributes, triatts);
    triangle_1.default(b, c, a, triatts, triangles);
    setAttributes([3, 0, 2], attributes, triatts);
    triangle_1.default(d, a, c, triatts, triangles);
    return triangles;
  }
  exports_1("default", quadrilateral);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(triangle_1_1) {
      triangle_1 = triangle_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/CuboidSimplexGeometry.js", ["../math/CartesianE3", "../geometries/computeFaceNormals", "../geometries/SimplexGeometry", "../geometries/quadrilateral", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/R1", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var CartesianE3_1,
      computeFaceNormals_1,
      SimplexGeometry_1,
      quadrilateral_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      R1_1,
      R3_1;
  var CuboidSimplexGeometry;
  return {
    setters: [function(CartesianE3_1_1) {
      CartesianE3_1 = CartesianE3_1_1;
    }, function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      CuboidSimplexGeometry = (function(_super) {
        __extends(CuboidSimplexGeometry, _super);
        function CuboidSimplexGeometry(a, b, c, k, subdivide, boundary) {
          if (a === void 0) {
            a = CartesianE3_1.default.e1;
          }
          if (b === void 0) {
            b = CartesianE3_1.default.e2;
          }
          if (c === void 0) {
            c = CartesianE3_1.default.e3;
          }
          if (k === void 0) {
            k = Simplex_1.default.TRIANGLE;
          }
          if (subdivide === void 0) {
            subdivide = 0;
          }
          if (boundary === void 0) {
            boundary = 0;
          }
          _super.call(this);
          this._isModified = true;
          this._a = CartesianE3_1.default.fromVectorE3(a);
          this._b = CartesianE3_1.default.fromVectorE3(b);
          this._c = CartesianE3_1.default.fromVectorE3(c);
          this.k = k;
          this.subdivide(subdivide);
          this.boundary(boundary);
          this.regenerate();
        }
        Object.defineProperty(CuboidSimplexGeometry.prototype, "a", {
          get: function() {
            return this._a;
          },
          set: function(a) {
            this._a = a;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "b", {
          get: function() {
            return this._b;
          },
          set: function(b) {
            this._b = b;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "c", {
          get: function() {
            return this._c;
          },
          set: function(c) {
            this._c = c;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        CuboidSimplexGeometry.prototype.isModified = function() {
          return this._isModified || _super.prototype.isModified.call(this);
        };
        CuboidSimplexGeometry.prototype.setModified = function(modified) {
          this._isModified = modified;
          _super.prototype.setModified.call(this, modified);
          return this;
        };
        CuboidSimplexGeometry.prototype.regenerate = function() {
          this.setModified(false);
          var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) {
            return void 0;
          });
          pos[0] = new R3_1.default().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
          pos[1] = new R3_1.default().add(this._a).sub(this._b).add(this._c).divByScalar(2);
          pos[2] = new R3_1.default().add(this._a).add(this._b).add(this._c).divByScalar(2);
          pos[3] = new R3_1.default().sub(this._a).add(this._b).add(this._c).divByScalar(2);
          pos[4] = new R3_1.default().copy(pos[3]).sub(this._c);
          pos[5] = new R3_1.default().copy(pos[2]).sub(this._c);
          pos[6] = new R3_1.default().copy(pos[1]).sub(this._c);
          pos[7] = new R3_1.default().copy(pos[0]).sub(this._c);
          var position = this.position;
          pos.forEach(function(point) {
            point.add(position);
          });
          function simplex(indices) {
            var simplex = new Simplex_1.default(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_GEOMETRY_INDEX] = new R1_1.default([i]);
            }
            return simplex;
          }
          switch (this.k) {
            case 0:
              {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                this.data = points.map(function(point) {
                  return simplex(point);
                });
              }
              break;
            case 1:
              {
                var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                this.data = lines.map(function(line) {
                  return simplex(line);
                });
              }
              break;
            case 2:
              {
                var faces = [0, 1, 2, 3, 4, 5].map(function(index) {
                  return void 0;
                });
                faces[0] = quadrilateral_1.default(pos[0], pos[1], pos[2], pos[3]);
                faces[1] = quadrilateral_1.default(pos[1], pos[6], pos[5], pos[2]);
                faces[2] = quadrilateral_1.default(pos[7], pos[0], pos[3], pos[4]);
                faces[3] = quadrilateral_1.default(pos[6], pos[7], pos[4], pos[5]);
                faces[4] = quadrilateral_1.default(pos[3], pos[2], pos[5], pos[4]);
                faces[5] = quadrilateral_1.default(pos[7], pos[6], pos[1], pos[0]);
                this.data = faces.reduce(function(a, b) {
                  return a.concat(b);
                }, []);
                this.data.forEach(function(simplex) {
                  computeFaceNormals_1.default(simplex);
                });
              }
              break;
            default:
              {}
          }
          this.check();
        };
        return CuboidSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", CuboidSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/DodecahedronSimplexGeometry.js", ["../geometries/PolyhedronSimplexGeometry"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var PolyhedronSimplexGeometry_1;
  var t,
      r,
      vertices,
      indices,
      DodecahedronSimplexGeometry;
  return {
    setters: [function(PolyhedronSimplexGeometry_1_1) {
      PolyhedronSimplexGeometry_1 = PolyhedronSimplexGeometry_1_1;
    }],
    execute: function() {
      t = (1 + Math.sqrt(5)) / 2;
      r = 1 / t;
      vertices = [-1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, -r, -t, 0, -r, t, 0, r, -t, 0, r, t, 0, -t, 0, -r, t, 0, -r, -t, 0, r, t, 0, r];
      indices = [3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9];
      DodecahedronSimplexGeometry = (function(_super) {
        __extends(DodecahedronSimplexGeometry, _super);
        function DodecahedronSimplexGeometry(radius, detail) {
          _super.call(this, vertices, indices, radius, detail);
        }
        return DodecahedronSimplexGeometry;
      })(PolyhedronSimplexGeometry_1.default);
      exports_1("default", DodecahedronSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/IcosahedronSimplexGeometry.js", ["../geometries/PolyhedronSimplexGeometry"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var PolyhedronSimplexGeometry_1;
  var t,
      vertices,
      indices,
      IcosahedronSimplexGeometry;
  return {
    setters: [function(PolyhedronSimplexGeometry_1_1) {
      PolyhedronSimplexGeometry_1 = PolyhedronSimplexGeometry_1_1;
    }],
    execute: function() {
      t = (1 + Math.sqrt(5)) / 2;
      vertices = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1];
      indices = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
      IcosahedronSimplexGeometry = (function(_super) {
        __extends(IcosahedronSimplexGeometry, _super);
        function IcosahedronSimplexGeometry(radius, detail) {
          _super.call(this, vertices, indices, radius, detail);
        }
        return IcosahedronSimplexGeometry;
      })(PolyhedronSimplexGeometry_1.default);
      exports_1("default", IcosahedronSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/KleinBottleSimplexGeometry.js", ["../geometries/GridSimplexGeometry", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GridSimplexGeometry_1,
      R3_1;
  var cos,
      sin,
      pi,
      KleinBottleSimplexGeometry;
  function klein(u, v) {
    var point = new R3_1.default();
    u = u * 2 * pi;
    v = v * 2 * pi;
    if (u < pi) {
      point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v);
      point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
    } else {
      point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi);
      point.z = -8 * sin(u);
    }
    point.y = -2 * (1 - cos(u) / 2) * sin(v);
    return point.scale(0.1);
  }
  return {
    setters: [function(GridSimplexGeometry_1_1) {
      GridSimplexGeometry_1 = GridSimplexGeometry_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      cos = Math.cos;
      sin = Math.sin;
      pi = Math.PI;
      KleinBottleSimplexGeometry = (function(_super) {
        __extends(KleinBottleSimplexGeometry, _super);
        function KleinBottleSimplexGeometry(uSegments, vSegments) {
          _super.call(this, klein, uSegments, vSegments);
        }
        return KleinBottleSimplexGeometry;
      })(GridSimplexGeometry_1.default);
      exports_1("default", KleinBottleSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/Simplex1Geometry.js", ["../geometries/SimplexGeometry", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var SimplexGeometry_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      R3_1;
  var Simplex1Geometry;
  return {
    setters: [function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      Simplex1Geometry = (function(_super) {
        __extends(Simplex1Geometry, _super);
        function Simplex1Geometry() {
          _super.call(this);
          this.head = new R3_1.default([1, 0, 0]);
          this.tail = new R3_1.default([0, 1, 0]);
          this.calculate();
        }
        Simplex1Geometry.prototype.calculate = function() {
          var pos = [0, 1].map(function(index) {
            return void 0;
          });
          pos[0] = this.tail;
          pos[1] = this.head;
          function simplex(indices) {
            var simplex = new Simplex_1.default(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
            }
            return simplex;
          }
          this.data = [[0, 1]].map(function(line) {
            return simplex(line);
          });
          this.check();
        };
        return Simplex1Geometry;
      })(SimplexGeometry_1.default);
      exports_1("default", Simplex1Geometry);
    }
  };
});

System.register("davinci-eight/geometries/MobiusStripSimplexGeometry.js", ["../geometries/GridSimplexGeometry", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GridSimplexGeometry_1,
      R3_1;
  var cos,
      sin,
      pi,
      MobiusStripSimplexGeometry;
  function mobius(u, v) {
    var point = new R3_1.default([0, 0, 0]);
    var R = 1;
    var w = 0.05;
    var s = (2 * u - 1) * w;
    var t = 2 * pi * v;
    point.x = (R + s * cos(t / 2)) * cos(t);
    point.y = (R + s * cos(t / 2)) * sin(t);
    point.z = s * sin(t / 2);
    return point;
  }
  return {
    setters: [function(GridSimplexGeometry_1_1) {
      GridSimplexGeometry_1 = GridSimplexGeometry_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      cos = Math.cos;
      sin = Math.sin;
      pi = Math.PI;
      MobiusStripSimplexGeometry = (function(_super) {
        __extends(MobiusStripSimplexGeometry, _super);
        function MobiusStripSimplexGeometry(uSegments, vSegments) {
          _super.call(this, mobius, uSegments, vSegments);
        }
        return MobiusStripSimplexGeometry;
      })(GridSimplexGeometry_1.default);
      exports_1("default", MobiusStripSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/OctahedronSimplexGeometry.js", ["../geometries/PolyhedronSimplexGeometry"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var PolyhedronSimplexGeometry_1;
  var vertices,
      indices,
      OctahedronSimplexGeometry;
  return {
    setters: [function(PolyhedronSimplexGeometry_1_1) {
      PolyhedronSimplexGeometry_1 = PolyhedronSimplexGeometry_1_1;
    }],
    execute: function() {
      vertices = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1];
      indices = [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2];
      OctahedronSimplexGeometry = (function(_super) {
        __extends(OctahedronSimplexGeometry, _super);
        function OctahedronSimplexGeometry(radius, detail) {
          _super.call(this, vertices, indices, radius, detail);
        }
        return OctahedronSimplexGeometry;
      })(PolyhedronSimplexGeometry_1.default);
      exports_1("default", OctahedronSimplexGeometry);
    }
  };
});

System.register("davinci-eight/checks/isFunction.js", [], function(exports_1) {
  function isFunction(x) {
    return (typeof x === 'function');
  }
  exports_1("default", isFunction);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeFunction.js", ["../checks/mustSatisfy", "../checks/isFunction"], function(exports_1) {
  var mustSatisfy_1,
      isFunction_1;
  function beFunction() {
    return "be a function";
  }
  function mustBeFunction(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
    return value;
  }
  exports_1("default", mustBeFunction);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isFunction_1_1) {
      isFunction_1 = isFunction_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/GridSimplexGeometry.js", ["../geometries/Simplex", "../geometries/SimplexGeometry", "../core/GraphicsProgramSymbols", "../math/R2", "../math/R3", "../checks/mustBeFunction", "../checks/mustBeInteger"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Simplex_1,
      SimplexGeometry_1,
      GraphicsProgramSymbols_1,
      R2_1,
      R3_1,
      mustBeFunction_1,
      mustBeInteger_1;
  var GridSimplexGeometry;
  return {
    setters: [function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(mustBeFunction_1_1) {
      mustBeFunction_1 = mustBeFunction_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }],
    execute: function() {
      GridSimplexGeometry = (function(_super) {
        __extends(GridSimplexGeometry, _super);
        function GridSimplexGeometry(parametricFunction, uSegments, vSegments) {
          _super.call(this);
          mustBeFunction_1.default('parametricFunction', parametricFunction);
          mustBeInteger_1.default('uSegments', uSegments);
          mustBeInteger_1.default('vSegments', vSegments);
          var points = [];
          var i;
          var j;
          var sliceCount = uSegments + 1;
          for (i = 0; i <= vSegments; i++) {
            var v = i / vSegments;
            for (j = 0; j <= uSegments; j++) {
              var u = j / uSegments;
              var point = parametricFunction(u, v);
              points.push(R3_1.default.copy(point));
            }
          }
          var a;
          var b;
          var c;
          var d;
          var uva;
          var uvb;
          var uvc;
          var uvd;
          for (i = 0; i < vSegments; i++) {
            for (j = 0; j < uSegments; j++) {
              a = i * sliceCount + j;
              b = i * sliceCount + j + 1;
              c = (i + 1) * sliceCount + j + 1;
              d = (i + 1) * sliceCount + j;
              uva = new R2_1.default([j / uSegments, i / vSegments]);
              uvb = new R2_1.default([(j + 1) / uSegments, i / vSegments]);
              uvc = new R2_1.default([(j + 1) / uSegments, (i + 1) / vSegments]);
              uvd = new R2_1.default([j / uSegments, (i + 1) / vSegments]);
              var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
              simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[a];
              simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uva;
              simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[b];
              simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvb;
              simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[d];
              simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvd;
              this.data.push(simplex);
              var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
              simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[b];
              simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvb;
              simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[c];
              simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvc;
              simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[d];
              simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvd;
              this.data.push(simplex);
            }
          }
        }
        return GridSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", GridSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/RevolutionSimplexGeometry.js", ["../geometries/SimplexGeometry", "../math/SpinG3", "../math/R2"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var SimplexGeometry_1,
      SpinG3_1,
      R2_1;
  var RevolutionSimplexGeometry;
  return {
    setters: [function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }],
    execute: function() {
      RevolutionSimplexGeometry = (function(_super) {
        __extends(RevolutionSimplexGeometry, _super);
        function RevolutionSimplexGeometry() {
          _super.call(this);
        }
        RevolutionSimplexGeometry.prototype.revolve = function(points, generator, segments, phiStart, phiLength, attitude) {
          if (segments === void 0) {
            segments = 12;
          }
          if (phiStart === void 0) {
            phiStart = 0;
          }
          if (phiLength === void 0) {
            phiLength = 2 * Math.PI;
          }
          var vertices = [];
          var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;
          var halfPlanes = isClosed ? segments : segments + 1;
          var inverseSegments = 1.0 / segments;
          var phiStep = (phiLength - phiStart) * inverseSegments;
          var i;
          var j;
          var il;
          var jl;
          var R = new SpinG3_1.default();
          for (i = 0, il = halfPlanes; i < il; i++) {
            var φ = phiStart + i * phiStep;
            R.rotorFromGeneratorAngle(generator, φ);
            for (j = 0, jl = points.length; j < jl; j++) {
              var vertex = points[j].clone();
              vertex.rotate(R);
              if (attitude) {
                vertex.rotate(attitude);
              }
              vertices.push(vertex);
            }
          }
          var inversePointLength = 1.0 / (points.length - 1);
          var np = points.length;
          var wrap = np * halfPlanes;
          for (i = 0, il = segments; i < il; i++) {
            for (j = 0, jl = points.length - 1; j < jl; j++) {
              var base = j + np * i;
              var a = base % wrap;
              var b = (base + np) % wrap;
              var c = (base + 1 + np) % wrap;
              var d = (base + 1) % wrap;
              var u0 = i * inverseSegments;
              var v0 = j * inversePointLength;
              var u1 = u0 + inverseSegments;
              var v1 = v0 + inversePointLength;
              this.triangle([vertices[d], vertices[b], vertices[a]], [], [new R2_1.default([u0, v0]), new R2_1.default([u1, v0]), new R2_1.default([u0, v1])]);
              this.triangle([vertices[d], vertices[c], vertices[b]], [], [new R2_1.default([u1, v0]), new R2_1.default([u1, v1]), new R2_1.default([u0, v1])]);
            }
          }
        };
        return RevolutionSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", RevolutionSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/RingSimplexGeometry.js", ["../geometries/arc3", "../geometries/Simplex", "../geometries/SliceSimplexGeometry", "../math/SpinG3", "../core/GraphicsProgramSymbols", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var arc3_1,
      Simplex_1,
      SliceSimplexGeometry_1,
      SpinG3_1,
      GraphicsProgramSymbols_1,
      R2_1,
      R3_1;
  var RingSimplexGeometry;
  function computeVertices(a, b, axis, start, angle, generator, radialSegments, thetaSegments, vertices, uvs) {
    var perp = R3_1.default.copy(axis).cross(start);
    var radius = b;
    var radiusStep = (a - b) / radialSegments;
    for (var i = 0; i < radialSegments + 1; i++) {
      var begin = R3_1.default.copy(start).scale(radius);
      var arcPoints = arc3_1.default(begin, angle, generator, thetaSegments);
      for (var j = 0,
          jLength = arcPoints.length; j < jLength; j++) {
        var arcPoint = arcPoints[j];
        vertices.push(arcPoint);
        uvs.push(new R2_1.default([(arcPoint.dot(start) / a + 1) / 2, (arcPoint.dot(perp) / a + 1) / 2]));
      }
      radius += radiusStep;
    }
  }
  function vertexIndex(i, j, thetaSegments) {
    return i * (thetaSegments + 1) + j;
  }
  function makeTriangles(vertices, uvs, axis, radialSegments, thetaSegments, geometry) {
    for (var i = 0; i < radialSegments; i++) {
      var startLineIndex = i * (thetaSegments + 1);
      for (var j = 0; j < thetaSegments; j++) {
        var quadIndex = startLineIndex + j;
        var v0 = quadIndex;
        var v1 = quadIndex + thetaSegments + 1;
        var v2 = quadIndex + thetaSegments + 2;
        geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3_1.default.copy(axis), R3_1.default.copy(axis), R3_1.default.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
        v0 = quadIndex;
        v1 = quadIndex + thetaSegments + 2;
        v2 = quadIndex + 1;
        geometry.triangle([vertices[v0], vertices[v1], vertices[v2]], [R3_1.default.copy(axis), R3_1.default.copy(axis), R3_1.default.copy(axis)], [uvs[v0].clone(), uvs[v1].clone(), uvs[v2].clone()]);
      }
    }
  }
  function makeLineSegments(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i < radialSegments; i++) {
      for (var j = 0; j < thetaSegments; j++) {
        var simplex = new Simplex_1.default(Simplex_1.default.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j + 1, thetaSegments)];
        data.push(simplex);
        var simplex = new Simplex_1.default(Simplex_1.default.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
        simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, j, thetaSegments)];
        data.push(simplex);
      }
      var simplex = new Simplex_1.default(Simplex_1.default.LINE);
      simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, thetaSegments, thetaSegments)];
      simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i + 1, thetaSegments, thetaSegments)];
      data.push(simplex);
    }
    for (var j = 0; j < thetaSegments; j++) {
      var simplex = new Simplex_1.default(Simplex_1.default.LINE);
      simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j, thetaSegments)];
      simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(radialSegments, j + 1, thetaSegments)];
      data.push(simplex);
    }
  }
  function makePoints(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i <= radialSegments; i++) {
      for (var j = 0; j <= thetaSegments; j++) {
        var simplex = new Simplex_1.default(Simplex_1.default.POINT);
        simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = vertices[vertexIndex(i, j, thetaSegments)];
        data.push(simplex);
      }
    }
  }
  function makeEmpty(vertices, radialSegments, thetaSegments, data) {
    for (var i = 0; i <= radialSegments; i++) {
      for (var j = 0; j <= thetaSegments; j++) {
        var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
        data.push(simplex);
      }
    }
  }
  return {
    setters: [function(arc3_1_1) {
      arc3_1 = arc3_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(SliceSimplexGeometry_1_1) {
      SliceSimplexGeometry_1 = SliceSimplexGeometry_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      RingSimplexGeometry = (function(_super) {
        __extends(RingSimplexGeometry, _super);
        function RingSimplexGeometry(a, b, axis, sliceStart, sliceAngle) {
          if (a === void 0) {
            a = 1;
          }
          if (b === void 0) {
            b = 0;
          }
          _super.call(this, axis, sliceStart, sliceAngle);
          this.a = a;
          this.b = b;
        }
        RingSimplexGeometry.prototype.isModified = function() {
          return _super.prototype.isModified.call(this);
        };
        RingSimplexGeometry.prototype.regenerate = function() {
          this.data = [];
          var radialSegments = this.flatSegments;
          var thetaSegments = this.curvedSegments;
          var generator = SpinG3_1.default.dual(this.axis);
          var vertices = [];
          var uvs = [];
          computeVertices(this.a, this.b, this.axis, this.sliceStart, this.sliceAngle, generator, radialSegments, thetaSegments, vertices, uvs);
          switch (this.k) {
            case Simplex_1.default.EMPTY:
              {
                makeEmpty(vertices, radialSegments, thetaSegments, this.data);
              }
              break;
            case Simplex_1.default.POINT:
              {
                makePoints(vertices, radialSegments, thetaSegments, this.data);
              }
              break;
            case Simplex_1.default.LINE:
              {
                makeLineSegments(vertices, radialSegments, thetaSegments, this.data);
              }
              break;
            case Simplex_1.default.TRIANGLE:
              {
                makeTriangles(vertices, uvs, this.axis, radialSegments, thetaSegments, this);
              }
              break;
            default:
              {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
              }
          }
          this.setModified(false);
        };
        RingSimplexGeometry.prototype.setModified = function(modified) {
          _super.prototype.setModified.call(this, modified);
          return this;
        };
        return RingSimplexGeometry;
      })(SliceSimplexGeometry_1.default);
      exports_1("default", RingSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/PolyhedronSimplexGeometry.js", ["../math/Euclidean3", "../geometries/SimplexGeometry", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Euclidean3_1,
      SimplexGeometry_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      R2_1,
      R3_1;
  var PolyhedronSimplexGeometry;
  function azimuth(vector) {
    return Math.atan2(vector.z, -vector.x);
  }
  function inclination(pos) {
    return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
  }
  function prepare(point, points) {
    var vertex = R3_1.default.copy(point).direction();
    points.push(vertex);
    var u = azimuth(point) / 2 / Math.PI + 0.5;
    var v = inclination(point) / Math.PI + 0.5;
    var something = vertex;
    something['uv'] = new R2_1.default([u, 1 - v]);
    return vertex;
  }
  function correctUV(uv, vector, azimuth) {
    if ((azimuth < 0) && (uv.x === 1))
      uv = new R2_1.default([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0))
      uv = new R2_1.default([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
  }
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      PolyhedronSimplexGeometry = (function(_super) {
        __extends(PolyhedronSimplexGeometry, _super);
        function PolyhedronSimplexGeometry(vertices, indices, radius, detail) {
          if (radius === void 0) {
            radius = 1;
          }
          if (detail === void 0) {
            detail = 0;
          }
          _super.call(this);
          var that = this;
          var points = [];
          for (var i = 0,
              l = vertices.length; i < l; i += 3) {
            prepare(new R3_1.default([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
          }
          var faces = [];
          for (var i = 0,
              j = 0,
              l = indices.length; i < l; i += 3, j++) {
            var v1 = points[indices[i]];
            var v2 = points[indices[i + 1]];
            var v3 = points[indices[i + 2]];
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v1;
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v2;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v2);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v3;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v3);
            faces[j] = simplex;
          }
          for (var i = 0,
              facesLength = faces.length; i < facesLength; i++) {
            subdivide(faces[i], detail, points);
          }
          for (var i = 0,
              verticesLength = points.length; i < verticesLength; i++) {
            points[i].x *= radius;
            points[i].y *= radius;
            points[i].z *= radius;
          }
          this.mergeVertices();
          function centroid(v1, v2, v3) {
            var x = (v1.x + v2.x + v3.x) / 3;
            var y = (v1.y + v2.y + v3.y) / 3;
            var z = (v1.z + v2.z + v3.z) / 3;
            return new Euclidean3_1.default(0, x, y, z, 0, 0, 0, 0);
          }
          function make(v1, v2, v3) {
            var azi = azimuth(centroid(v1, v2, v3));
            var something1 = v1;
            var something2 = v2;
            var something3 = v3;
            var uv1 = correctUV(something1['uv'], v1, azi);
            var uv2 = correctUV(something2['uv'], v2, azi);
            var uv3 = correctUV(something3['uv'], v3, azi);
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv1;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv2;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = R3_1.default.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv3;
            that.data.push(simplex);
          }
          function subdivide(face, detail, points) {
            var cols = Math.pow(2, detail);
            var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var v = [];
            for (var i = 0; i <= cols; i++) {
              v[i] = [];
              var aj = prepare(R3_1.default.copy(a).lerp(c, i / cols), points);
              var bj = prepare(R3_1.default.copy(b).lerp(c, i / cols), points);
              var rows = cols - i;
              for (var j = 0; j <= rows; j++) {
                if (j == 0 && i == cols) {
                  v[i][j] = aj;
                } else {
                  v[i][j] = prepare(R3_1.default.copy(aj).lerp(bj, j / rows), points);
                }
              }
            }
            for (var i = 0; i < cols; i++) {
              for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                var k = Math.floor(j / 2);
                if (j % 2 == 0) {
                  make(v[i][k + 1], v[i + 1][k], v[i][k]);
                } else {
                  make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                }
              }
            }
          }
        }
        return PolyhedronSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", PolyhedronSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/TetrahedronSimplexGeometry.js", ["../geometries/PolyhedronSimplexGeometry"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var PolyhedronSimplexGeometry_1;
  var vertices,
      indices,
      TetrahedronSimplexGeometry;
  return {
    setters: [function(PolyhedronSimplexGeometry_1_1) {
      PolyhedronSimplexGeometry_1 = PolyhedronSimplexGeometry_1_1;
    }],
    execute: function() {
      vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];
      indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
      TetrahedronSimplexGeometry = (function(_super) {
        __extends(TetrahedronSimplexGeometry, _super);
        function TetrahedronSimplexGeometry(radius, detail) {
          _super.call(this, vertices, indices, radius, detail);
        }
        return TetrahedronSimplexGeometry;
      })(PolyhedronSimplexGeometry_1.default);
      exports_1("default", TetrahedronSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/VortexSimplexGeometry.js", ["../math/Euclidean3", "../geometries/SimplexGeometry", "../checks/mustBeInteger", "../math/SpinG3", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Euclidean3_1,
      SimplexGeometry_1,
      mustBeInteger_1,
      SpinG3_1,
      R2_1,
      R3_1;
  var VortexSimplexGeometry;
  function perpendicular(to) {
    var random = new R3_1.default([Math.random(), Math.random(), Math.random()]);
    random.cross(to).direction();
    return new Euclidean3_1.default(0, random.x, random.y, random.z, 0, 0, 0, 0);
  }
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      VortexSimplexGeometry = (function(_super) {
        __extends(VortexSimplexGeometry, _super);
        function VortexSimplexGeometry() {
          _super.call(this);
          this.radius = 1;
          this.radiusCone = 0.08;
          this.radiusShaft = 0.01;
          this.lengthCone = 0.2;
          this.lengthShaft = 0.8;
          this.arrowSegments = 8;
          this.radialSegments = 12;
          this.generator = SpinG3_1.default.dual(R3_1.default.e3);
          this.setModified(true);
        }
        VortexSimplexGeometry.prototype.isModified = function() {
          return this.generator.modified;
        };
        VortexSimplexGeometry.prototype.setModified = function(modified) {
          this.generator.modified = modified;
          return this;
        };
        VortexSimplexGeometry.prototype.regenerate = function() {
          this.data = [];
          var radius = this.radius;
          var radiusCone = this.radiusCone;
          var radiusShaft = this.radiusShaft;
          var radialSegments = this.radialSegments;
          var axis = new Euclidean3_1.default(0, -this.generator.yz, -this.generator.zx, -this.generator.xy, 0, 0, 0, 0);
          var radial = perpendicular(axis);
          var R0 = radial.scale(this.radius);
          var generator = new Euclidean3_1.default(this.generator.α, 0, 0, 0, this.generator.xy, this.generator.yz, this.generator.zx, 0);
          var Rminor0 = axis.ext(radial);
          var n = 9;
          var circleSegments = this.arrowSegments * n;
          var tau = Math.PI * 2;
          var center = new R3_1.default([0, 0, 0]);
          var normals = [];
          var points = [];
          var uvs = [];
          var alpha = this.lengthShaft / (this.lengthCone + this.lengthShaft);
          var factor = tau / this.arrowSegments;
          var theta = alpha / (n - 2);
          function computeAngle(index) {
            mustBeInteger_1.default('index', index);
            var m = index % n;
            if (m === n - 1) {
              return computeAngle(index - 1);
            } else {
              var a = (index - m) / n;
              return factor * (a + m * theta);
            }
          }
          function computeRadius(index) {
            mustBeInteger_1.default('index', index);
            var m = index % n;
            if (m === n - 1) {
              return radiusCone;
            } else {
              return radiusShaft;
            }
          }
          for (var j = 0; j <= radialSegments; j++) {
            var v = tau * j / radialSegments;
            for (var i = 0; i <= circleSegments; i++) {
              var u = computeAngle(i);
              var Rmajor = generator.scale(-u / 2).exp();
              center.copy(R0).rotate(Rmajor);
              var vertex = R3_1.default.copy(center);
              var r0 = axis.scale(computeRadius(i));
              var Rminor = Rmajor.mul(Rminor0).mul(Rmajor.__tilde__()).scale(-v / 2).exp();
              var r = Rminor.mul(r0).mul(Rminor.__tilde__());
              vertex.add2(center, r);
              points.push(vertex);
              uvs.push(new R2_1.default([i / circleSegments, j / radialSegments]));
              normals.push(R3_1.default.copy(r).direction());
            }
          }
          for (var j = 1; j <= radialSegments; j++) {
            for (var i = 1; i <= circleSegments; i++) {
              var a = (circleSegments + 1) * j + i - 1;
              var b = (circleSegments + 1) * (j - 1) + i - 1;
              var c = (circleSegments + 1) * (j - 1) + i;
              var d = (circleSegments + 1) * j + i;
              this.triangle([points[a], points[b], points[d]], [normals[a], normals[b], normals[d]], [uvs[a], uvs[b], uvs[d]]);
              this.triangle([points[b], points[c], points[d]], [normals[b], normals[c], normals[d]], [uvs[b], uvs[c], uvs[d]]);
            }
          }
          this.setModified(false);
        };
        return VortexSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", VortexSimplexGeometry);
    }
  };
});

System.register("davinci-eight/utils/mergeStringMapList.js", [], function(exports_1) {
  function mergeStringMapList(ms) {
    var result = {};
    ms.forEach(function(m) {
      var keys = Object.keys(m);
      var keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        var value = m[key];
        result[key] = value;
      }
    });
    return result;
  }
  exports_1("default", mergeStringMapList);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/programs/smartProgram.js", ["../programs/fragmentShader", "../utils/mergeStringMapList", "../checks/mustBeDefined", "../core/ShareableWebGLProgram", "../programs/vColorRequired", "../programs/vertexShader", "../programs/vLightRequired"], function(exports_1) {
  var fragmentShader_1,
      mergeStringMapList_1,
      mustBeDefined_1,
      ShareableWebGLProgram_1,
      vColorRequired_1,
      vertexShader_1,
      vLightRequired_1;
  function smartProgram(attributes, uniformsList, bindings) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniformsList', uniformsList);
    var uniforms = mergeStringMapList_1.default(uniformsList);
    var vColor = vColorRequired_1.default(attributes, uniforms);
    var vLight = vLightRequired_1.default(attributes, uniforms);
    return new ShareableWebGLProgram_1.default(vertexShader_1.default(attributes, uniforms, vColor, vLight), fragmentShader_1.default(attributes, uniforms, vColor, vLight), bindings);
  }
  exports_1("default", smartProgram);
  return {
    setters: [function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(mergeStringMapList_1_1) {
      mergeStringMapList_1 = mergeStringMapList_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }, function(vColorRequired_1_1) {
      vColorRequired_1 = vColorRequired_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }, function(vLightRequired_1_1) {
      vLightRequired_1 = vLightRequired_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/programs/programFromScripts.js", ["../checks/mustBeObject", "../checks/mustBeString", "../core/ShareableWebGLProgram"], function(exports_1) {
  var mustBeObject_1,
      mustBeString_1,
      ShareableWebGLProgram_1;
  function programFromScripts(vsId, fsId, dom, attribs) {
    if (attribs === void 0) {
      attribs = [];
    }
    mustBeString_1.default('vsId', vsId);
    mustBeString_1.default('fsId', fsId);
    mustBeObject_1.default('dom', dom);
    function $(id) {
      var element = dom.getElementById(mustBeString_1.default('id', id));
      if (element) {
        return element;
      } else {
        throw new Error(id + " is not a valid DOM element identifier.");
      }
    }
    var vertexShader = $(vsId).textContent;
    var fragmentShader = $(fsId).textContent;
    return new ShareableWebGLProgram_1.default(vertexShader, fragmentShader, attribs);
  }
  exports_1("default", programFromScripts);
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/HTMLScriptsGraphicsProgram.js", ["../checks/mustBeObject", "../checks/mustBeString", "../core/ShareableWebGLProgram"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeObject_1,
      mustBeString_1,
      ShareableWebGLProgram_1;
  var HTMLScriptsGraphicsProgram;
  function $(id, dom) {
    var element = dom.getElementById(mustBeString_1.default('id', id));
    if (element) {
      return element;
    } else {
      throw new Error(id + " is not a valid DOM element identifier.");
    }
  }
  function vertexShader(scriptIds, dom) {
    var vsId = scriptIds[0];
    mustBeString_1.default('vsId', vsId);
    mustBeObject_1.default('dom', dom);
    return $(vsId, dom).textContent;
  }
  function fragmentShader(scriptIds, dom) {
    var fsId = scriptIds[1];
    mustBeString_1.default('fsId', fsId);
    mustBeObject_1.default('dom', dom);
    return $(fsId, dom).textContent;
  }
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {
      HTMLScriptsGraphicsProgram = (function(_super) {
        __extends(HTMLScriptsGraphicsProgram, _super);
        function HTMLScriptsGraphicsProgram(scriptIds, dom) {
          if (scriptIds === void 0) {
            scriptIds = [];
          }
          if (dom === void 0) {
            dom = document;
          }
          _super.call(this, vertexShader(scriptIds, dom), fragmentShader(scriptIds, dom));
        }
        return HTMLScriptsGraphicsProgram;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", HTMLScriptsGraphicsProgram);
    }
  };
});

System.register("davinci-eight/materials/LineMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/ShareableWebGLProgram"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      ShareableWebGLProgram_1;
  var LineMaterial;
  function vertexShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
    return gpb.vertexShader();
  }
  function fragmentShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
    return gpb.fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {
      LineMaterial = (function(_super) {
        __extends(LineMaterial, _super);
        function LineMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return LineMaterial;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", LineMaterial);
    }
  };
});

System.register("davinci-eight/materials/MeshMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/ShareableWebGLProgram"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      ShareableWebGLProgram_1;
  var MeshMaterial;
  function vertexShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return gpb.vertexShader();
  }
  function fragmentShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return gpb.fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {
      MeshMaterial = (function(_super) {
        __extends(MeshMaterial, _super);
        function MeshMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshMaterial;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", MeshMaterial);
    }
  };
});

System.register("davinci-eight/materials/PointMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/ShareableWebGLProgram"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      ShareableWebGLProgram_1;
  var PointMaterial;
  function vertexShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
    return gpb.vertexShader();
  }
  function fragmentShader() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
    return gpb.fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {
      PointMaterial = (function(_super) {
        __extends(PointMaterial, _super);
        function PointMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return PointMaterial;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", PointMaterial);
    }
  };
});

System.register("davinci-eight/math/mathcore.js", [], function(exports_1) {
  var abs,
      acos,
      asin,
      atan,
      cos,
      exp,
      log,
      sin,
      sqrt,
      tan,
      mathcore;
  function isCallableMethod(x, name) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
  }
  function makeUnaryUniversalFunction(methodName, primitiveFunction) {
    return function(x) {
      var something = x;
      if (isCallableMethod(x, methodName)) {
        return something[methodName]();
      } else if (typeof x === 'number') {
        var n = something;
        var thing = primitiveFunction(n);
        return thing;
      } else {
        throw new TypeError("x must support " + methodName + "(x)");
      }
    };
  }
  function cosh(x) {
    return (exp(x) + exp(-x)) / 2;
  }
  function sinh(x) {
    return (exp(x) - exp(-x)) / 2;
  }
  function tanh(x) {
    return sinh(x) / cosh(x);
  }
  function quad(x) {
    return x * x;
  }
  return {
    setters: [],
    execute: function() {
      abs = Math.abs;
      acos = Math.acos;
      asin = Math.asin;
      atan = Math.atan;
      cos = Math.cos;
      exp = Math.exp;
      log = Math.log;
      sin = Math.sin;
      sqrt = Math.sqrt;
      tan = Math.tan;
      mathcore = {
        acos: makeUnaryUniversalFunction('acos', acos),
        asin: makeUnaryUniversalFunction('asin', asin),
        atan: makeUnaryUniversalFunction('atan', atan),
        cos: makeUnaryUniversalFunction('cos', cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', exp),
        log: makeUnaryUniversalFunction('log', log),
        norm: makeUnaryUniversalFunction('norm', abs),
        quad: makeUnaryUniversalFunction('quad', quad),
        sin: makeUnaryUniversalFunction('sin', sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', sqrt),
        tan: makeUnaryUniversalFunction('tan', tan),
        tanh: makeUnaryUniversalFunction('tanh', tanh),
        Math: {
          cosh: cosh,
          sinh: sinh
        }
      };
      exports_1("default", mathcore);
    }
  };
});

System.register("davinci-eight/math/R4.js", ["../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var VectorN_1;
  var R4;
  return {
    setters: [function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      R4 = (function(_super) {
        __extends(R4, _super);
        function R4(data, modified) {
          if (data === void 0) {
            data = [0, 0, 0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 4);
        }
        Object.defineProperty(R4.prototype, "x", {
          get: function() {
            return this.coords[0];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[0] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R4.prototype, "y", {
          get: function() {
            return this.coords[1];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[1] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R4.prototype, "z", {
          get: function() {
            return this.coords[2];
          },
          set: function(value) {
            this.modified = this.modified || this.z !== value;
            this.coords[2] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R4.prototype, "w", {
          get: function() {
            return this.coords[3];
          },
          set: function(value) {
            this.modified = this.modified || this.w !== value;
            this.coords[3] = value;
          },
          enumerable: true,
          configurable: true
        });
        R4.prototype.setW = function(w) {
          this.w = w;
          return this;
        };
        R4.prototype.add = function(vector, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += vector.x * α;
          this.y += vector.y * α;
          this.z += vector.z * α;
          this.w += vector.w * α;
          return this;
        };
        R4.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          this.w = a.w + b.w;
          return this;
        };
        R4.prototype.clone = function() {
          return new R4([this.x, this.y, this.z, this.w]);
        };
        R4.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          this.w = v.w;
          return this;
        };
        R4.prototype.divByScalar = function(α) {
          this.x /= α;
          this.y /= α;
          this.z /= α;
          this.w /= α;
          return this;
        };
        R4.prototype.lerp = function(target, α) {
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          this.w += (target.w - this.w) * α;
          return this;
        };
        R4.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        R4.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          this.w = -this.w;
          return this;
        };
        R4.prototype.scale = function(α) {
          this.x *= α;
          this.y *= α;
          this.z *= α;
          this.w *= α;
          return this;
        };
        R4.prototype.reflect = function(n) {
          return this;
        };
        R4.prototype.rotate = function(rotor) {
          return this;
        };
        R4.prototype.slerp = function(target, α) {
          return this;
        };
        R4.prototype.sub = function(v, α) {
          this.x -= v.x * α;
          this.y -= v.y * α;
          this.z -= v.z * α;
          this.w -= v.w * α;
          return this;
        };
        R4.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          this.w = a.w - b.w;
          return this;
        };
        R4.prototype.magnitude = function() {
          throw new Error("TODO: R4.magnitude()");
        };
        R4.prototype.squaredNorm = function() {
          throw new Error("TODO: R4.squaredNorm()");
        };
        R4.prototype.toExponential = function() {
          return "TODO R4.toExponential";
        };
        R4.prototype.toFixed = function(digits) {
          return "TODO R4.toFixed";
        };
        R4.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.w = 0;
          return this;
        };
        return R4;
      })(VectorN_1.default);
      exports_1("default", R4);
    }
  };
});

System.register("davinci-eight/facets/AmbientLight.js", ["../core/Color", "../checks/mustBeArray", "../checks/mustBeNumber", "../checks/mustBeObject", "../checks/mustBeString", "../core/Shareable", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Color_1,
      mustBeArray_1,
      mustBeNumber_1,
      mustBeObject_1,
      mustBeString_1,
      Shareable_1,
      GraphicsProgramSymbols_1;
  var LOGGING_NAME,
      AmbientLight;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'AmbientLight';
      AmbientLight = (function(_super) {
        __extends(AmbientLight, _super);
        function AmbientLight(color) {
          _super.call(this, 'AmbientLight');
          mustBeObject_1.default('color', color);
          this.color = Color_1.default.white.clone();
          this.color.r = mustBeNumber_1.default('color.r', color.r);
          this.color.g = mustBeNumber_1.default('color.g', color.g);
          this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        AmbientLight.prototype.getProperty = function(name) {
          return void 0;
        };
        AmbientLight.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeArray_1.default('value', value, contextBuilder);
          return this;
        };
        AmbientLight.prototype.setUniforms = function(visitor) {
          var coords = [this.color.r, this.color.g, this.color.b];
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, coords);
        };
        return AmbientLight;
      })(Shareable_1.default);
      exports_1("default", AmbientLight);
    }
  };
});

System.register("davinci-eight/facets/DirectionalLight.js", ["../core/Color", "../checks/mustBeObject", "../checks/mustBeString", "../core/Shareable", "../core/GraphicsProgramSymbols", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Color_1,
      mustBeObject_1,
      mustBeString_1,
      Shareable_1,
      GraphicsProgramSymbols_1,
      R3_1;
  var LOGGING_NAME,
      DirectionalLight;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'DirectionalLight';
      DirectionalLight = (function(_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight(direction, color) {
          if (color === void 0) {
            color = Color_1.default.white;
          }
          _super.call(this, 'DirectionalLight');
          mustBeObject_1.default('direction', direction);
          mustBeObject_1.default('color', color);
          this.direction = R3_1.default.copy(direction).direction();
          this.color = Color_1.default.fromColor(color);
        }
        DirectionalLight.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        DirectionalLight.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name, contextBuilder);
          switch (name) {
            case DirectionalLight.PROP_COLOR:
              {
                return this.color.coords;
              }
              break;
            case DirectionalLight.PROP_DIRECTION:
              {
                return this.direction.coords;
              }
              break;
            default:
              {
                console.warn("unknown property: " + name);
              }
          }
        };
        DirectionalLight.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeObject_1.default('value', value, contextBuilder);
          switch (name) {
            case DirectionalLight.PROP_COLOR:
              {
                this.color.coords = value;
              }
              break;
            case DirectionalLight.PROP_DIRECTION:
              {
                this.direction.coords = value;
              }
              break;
            default:
              {
                console.warn("unknown property: " + name);
              }
          }
          return this;
        };
        DirectionalLight.prototype.setColor = function(color) {
          mustBeObject_1.default('color', color);
          this.color.copy(color);
          return this;
        };
        DirectionalLight.prototype.setDirection = function(direction) {
          mustBeObject_1.default('direction', direction);
          this.direction.copy(direction).direction();
          return this;
        };
        DirectionalLight.prototype.setUniforms = function(visitor) {
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords);
          var coords = [this.color.r, this.color.g, this.color.b];
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords);
        };
        DirectionalLight.PROP_COLOR = 'color';
        DirectionalLight.PROP_DIRECTION = 'direction';
        return DirectionalLight;
      })(Shareable_1.default);
      exports_1("default", DirectionalLight);
    }
  };
});

System.register("davinci-eight/facets/EulerFacet.js", ["../i18n/readOnly", "../core/Shareable", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var readOnly_1,
      Shareable_1,
      R3_1;
  var EulerFacet;
  return {
    setters: [function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      EulerFacet = (function(_super) {
        __extends(EulerFacet, _super);
        function EulerFacet() {
          _super.call(this, 'EulerFacet');
          this._rotation = new R3_1.default();
        }
        EulerFacet.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        EulerFacet.prototype.getProperty = function(name) {
          return void 0;
        };
        EulerFacet.prototype.setProperty = function(name, value) {
          return this;
        };
        EulerFacet.prototype.setUniforms = function(visitor) {
          console.warn("EulerFacet.setUniforms");
        };
        Object.defineProperty(EulerFacet.prototype, "rotation", {
          get: function() {
            return this._rotation;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('rotation').message);
          },
          enumerable: true,
          configurable: true
        });
        return EulerFacet;
      })(Shareable_1.default);
      exports_1("default", EulerFacet);
    }
  };
});

System.register("davinci-eight/facets/PointSizeFacet.js", ["../checks/mustBeArray", "../checks/mustBeInteger", "../checks/mustBeString", "../core/Shareable", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeArray_1,
      mustBeInteger_1,
      mustBeString_1,
      Shareable_1,
      GraphicsProgramSymbols_1;
  var LOGGING_NAME,
      PointSizeFacet;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'PointSizeFacet';
      PointSizeFacet = (function(_super) {
        __extends(PointSizeFacet, _super);
        function PointSizeFacet(pointSize) {
          if (pointSize === void 0) {
            pointSize = 2;
          }
          _super.call(this, 'PointSizeFacet');
          this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        PointSizeFacet.prototype.getProperty = function(name) {
          return void 0;
        };
        PointSizeFacet.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeArray_1.default('value', value, contextBuilder);
          return this;
        };
        PointSizeFacet.prototype.setUniforms = function(visitor) {
          visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize);
        };
        return PointSizeFacet;
      })(Shareable_1.default);
      exports_1("default", PointSizeFacet);
    }
  };
});

System.register("davinci-eight/math/add2x2.js", [], function(exports_1) {
  function default_1(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x2];
    var a21 = a[0x1],
        a22 = a[0x3];
    var b11 = b[0x0],
        b12 = b[0x2];
    var b21 = b[0x1],
        b22 = b[0x3];
    c[0x0] = a11 + b11;
    c[0x2] = a12 + b12;
    c[0x1] = a21 + b21;
    c[0x3] = a22 + b22;
    return c;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/det2x2.js", [], function(exports_1) {
  function default_1(m) {
    var n11 = m[0x0];
    var n12 = m[0x2];
    var n21 = m[0x1];
    var n22 = m[0x3];
    return n11 * n22 - n12 * n21;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Mat2R.js", ["../math/AbstractMatrix", "../math/add2x2", "../math/det2x2", "../checks/isDefined", "../checks/mustBeInteger", "../checks/mustBeNumber"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add2x2_1,
      det2x2_1,
      isDefined_1,
      mustBeInteger_1,
      mustBeNumber_1;
  var Mat2R;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add2x2_1_1) {
      add2x2_1 = add2x2_1_1;
    }, function(det2x2_1_1) {
      det2x2_1 = det2x2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {
      Mat2R = (function(_super) {
        __extends(Mat2R, _super);
        function Mat2R(elements) {
          _super.call(this, elements, 2);
        }
        Mat2R.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Mat2R.prototype.add2 = function(a, b) {
          add2x2_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Mat2R.prototype.clone = function() {
          var te = this.elements;
          var m11 = te[0];
          var m21 = te[1];
          var m12 = te[2];
          var m22 = te[3];
          return Mat2R.zero().set(m11, m12, m21, m22);
        };
        Mat2R.prototype.det = function() {
          return det2x2_1.default(this.elements);
        };
        Mat2R.prototype.inv = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          var det = this.det();
          return this.set(d, -b, -c, a).scale(1 / det);
        };
        Mat2R.prototype.isOne = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          return (a === 1 && b === 0 && c === 0 && d === 1);
        };
        Mat2R.prototype.isZero = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          return (a === 0 && b === 0 && c === 0 && d === 0);
        };
        Mat2R.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Mat2R.prototype.mul2 = function(a, b) {
          var ae = a.elements;
          var a11 = ae[0];
          var a21 = ae[1];
          var a12 = ae[2];
          var a22 = ae[3];
          var be = b.elements;
          var b11 = be[0];
          var b21 = be[1];
          var b12 = be[2];
          var b22 = be[3];
          var m11 = a11 * b11 + a12 * b21;
          var m12 = a11 * b12 + a12 * b22;
          var m21 = a21 * b11 + a22 * b21;
          var m22 = a21 * b12 + a22 * b22;
          return this.set(m11, m12, m21, m22);
        };
        Mat2R.prototype.neg = function() {
          return this.scale(-1);
        };
        Mat2R.prototype.one = function() {
          return this.set(1, 0, 0, 1);
        };
        Mat2R.prototype.reflection = function(n) {
          var nx = mustBeNumber_1.default('n.x', n.x);
          var xx = 1 - 2 * nx * nx;
          return this.set(xx, 0, 0, 1);
        };
        Mat2R.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[2 + i]];
        };
        Mat2R.prototype.scale = function(α) {
          var te = this.elements;
          var m11 = te[0] * α;
          var m21 = te[1] * α;
          var m12 = te[2] * α;
          var m22 = te[3] * α;
          return this.set(m11, m12, m21, m22);
        };
        Mat2R.prototype.set = function(m11, m12, m21, m22) {
          var te = this.elements;
          te[0x0] = m11;
          te[0x2] = m12;
          te[0x1] = m21;
          te[0x3] = m22;
          return this;
        };
        Mat2R.prototype.sub = function(rhs) {
          var te = this.elements;
          var t11 = te[0];
          var t21 = te[1];
          var t12 = te[2];
          var t22 = te[3];
          var re = rhs.elements;
          var r11 = re[0];
          var r21 = re[1];
          var r12 = re[2];
          var r22 = re[3];
          var m11 = t11 - r11;
          var m21 = t21 - r21;
          var m12 = t12 - r12;
          var m22 = t22 - r22;
          return this.set(m11, m12, m21, m22);
        };
        Mat2R.prototype.toExponential = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toExponential();
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat2R.prototype.toFixed = function(digits) {
          if (isDefined_1.default(digits)) {
            mustBeInteger_1.default('digits', digits);
          }
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toFixed(digits);
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat2R.prototype.toString = function() {
          var text = [];
          for (var i = 0,
              iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat2R.prototype.translation = function(d) {
          var x = d.x;
          return this.set(1, x, 0, 1);
        };
        Mat2R.prototype.zero = function() {
          return this.set(0, 0, 0, 0);
        };
        Mat2R.prototype.__add__ = function(rhs) {
          if (rhs instanceof Mat2R) {
            return this.clone().add(rhs);
          } else {
            return void 0;
          }
        };
        Mat2R.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Mat2R) {
            return lhs.clone().add(this);
          } else {
            return void 0;
          }
        };
        Mat2R.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Mat2R) {
            return this.clone().mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Mat2R.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Mat2R) {
            return lhs.clone().mul(this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        Mat2R.prototype.__pos__ = function() {
          return this.clone();
        };
        Mat2R.prototype.__neg__ = function() {
          return this.clone().scale(-1);
        };
        Mat2R.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Mat2R) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        Mat2R.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Mat2R) {
            return lhs.clone().sub(this);
          } else {
            return void 0;
          }
        };
        Mat2R.one = function() {
          return new Mat2R(new Float32Array([1, 0, 0, 1]));
        };
        Mat2R.reflection = function(n) {
          return Mat2R.zero().reflection(n);
        };
        Mat2R.zero = function() {
          return new Mat2R(new Float32Array([0, 0, 0, 0]));
        };
        return Mat2R;
      })(AbstractMatrix_1.default);
      exports_1("default", Mat2R);
    }
  };
});

System.register("davinci-eight/facets/ReflectionFacetE2.js", ["../checks/mustBeArray", "../checks/mustBeString", "../math/R2", "../math/Mat2R", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeArray_1,
      mustBeString_1,
      R2_1,
      Mat2R_1,
      readOnly_1,
      Shareable_1;
  var ReflectionFacetE2;
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(Mat2R_1_1) {
      Mat2R_1 = Mat2R_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ReflectionFacetE2 = (function(_super) {
        __extends(ReflectionFacetE2, _super);
        function ReflectionFacetE2(name) {
          _super.call(this, 'ReflectionFacetE2');
          this.matrix = Mat2R_1.default.one();
          this.name = mustBeString_1.default('name', name);
          this._normal = new R2_1.default().zero();
          this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
          get: function() {
            return this._normal;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('normal').message);
          },
          enumerable: true,
          configurable: true
        });
        ReflectionFacetE2.prototype.destructor = function() {
          this._normal = void 0;
          this.matrix = void 0;
          _super.prototype.destructor.call(this);
        };
        ReflectionFacetE2.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          return void 0;
        };
        ReflectionFacetE2.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('value', value);
          return this;
        };
        ReflectionFacetE2.prototype.setUniforms = function(visitor) {
          if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
          }
          visitor.mat2(this.name, this.matrix, false);
        };
        return ReflectionFacetE2;
      })(Shareable_1.default);
      exports_1("default", ReflectionFacetE2);
    }
  };
});

System.register("davinci-eight/facets/ReflectionFacetE3.js", ["../math/CartesianE3", "../checks/mustBeArray", "../checks/mustBeString", "../math/R3", "../math/Mat4R", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var CartesianE3_1,
      mustBeArray_1,
      mustBeString_1,
      R3_1,
      Mat4R_1,
      readOnly_1,
      Shareable_1;
  var ReflectionFacetE3;
  return {
    setters: [function(CartesianE3_1_1) {
      CartesianE3_1 = CartesianE3_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ReflectionFacetE3 = (function(_super) {
        __extends(ReflectionFacetE3, _super);
        function ReflectionFacetE3(name) {
          _super.call(this, 'ReflectionFacetE3');
          this.matrix = Mat4R_1.default.one();
          this.name = mustBeString_1.default('name', name);
          this._normal = new R3_1.default().copy(CartesianE3_1.default.zero);
          this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
          get: function() {
            return this._normal;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('normal').message);
          },
          enumerable: true,
          configurable: true
        });
        ReflectionFacetE3.prototype.destructor = function() {
          this._normal = void 0;
          this.matrix = void 0;
          _super.prototype.destructor.call(this);
        };
        ReflectionFacetE3.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          return void 0;
        };
        ReflectionFacetE3.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('value', value);
          return this;
        };
        ReflectionFacetE3.prototype.setUniforms = function(visitor) {
          if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
          }
          visitor.mat4(this.name, this.matrix, false);
        };
        return ReflectionFacetE3;
      })(Shareable_1.default);
      exports_1("default", ReflectionFacetE3);
    }
  };
});

System.register("davinci-eight/facets/Vector3Facet.js", ["../checks/mustBeObject", "../checks/mustBeString", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeObject_1,
      mustBeString_1,
      Shareable_1;
  var LOGGING_NAME,
      Vector3Facet;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'Vector3Facet';
      Vector3Facet = (function(_super) {
        __extends(Vector3Facet, _super);
        function Vector3Facet(name, vector) {
          _super.call(this, 'Vector3Facet');
          this._name = mustBeString_1.default('name', name, contextBuilder);
          this._vector = mustBeObject_1.default('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Vector3Facet.prototype.getProperty = function(name) {
          return void 0;
        };
        Vector3Facet.prototype.setProperty = function(name, value) {
          return this;
        };
        Vector3Facet.prototype.setUniforms = function(visitor) {
          visitor.vec3(this._name, this._vector);
        };
        return Vector3Facet;
      })(Shareable_1.default);
      exports_1("default", Vector3Facet);
    }
  };
});

System.register("davinci-eight/math/quadSpinorE2.js", ["../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var isDefined_1,
      isNumber_1;
  function quadSpinorE2(s) {
    if (isDefined_1.default(s)) {
      var α = s.α;
      var xy = s.xy;
      if (isNumber_1.default(α) && isNumber_1.default(xy)) {
        return α * α + xy * xy;
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadSpinorE2);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/SpinG2.js", ["../math/dotVectorCartesianE2", "../math/dotVectorE2", "../checks/isDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadSpinorE2", "../math/quadVectorE2", "../math/rotorFromDirections", "../math/VectorN", "../math/wedgeXY"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorCartesianE2_1,
      dotVectorE2_1,
      isDefined_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadSpinorE2_1,
      quadVectorE2_1,
      rotorFromDirections_1,
      VectorN_1,
      wedgeXY_1;
  var COORD_XY,
      COORD_ALPHA,
      PI,
      abs,
      atan2,
      exp,
      log,
      cos,
      sin,
      sqrt,
      SpinG2;
  function one() {
    var coords = [0, 0];
    coords[COORD_ALPHA] = 1;
    coords[COORD_XY] = 0;
    return coords;
  }
  return {
    setters: [function(dotVectorCartesianE2_1_1) {
      dotVectorCartesianE2_1 = dotVectorCartesianE2_1_1;
    }, function(dotVectorE2_1_1) {
      dotVectorE2_1 = dotVectorE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadSpinorE2_1_1) {
      quadSpinorE2_1 = quadSpinorE2_1_1;
    }, function(quadVectorE2_1_1) {
      quadVectorE2_1 = quadVectorE2_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }],
    execute: function() {
      COORD_XY = 0;
      COORD_ALPHA = 1;
      PI = Math.PI;
      abs = Math.abs;
      atan2 = Math.atan2;
      exp = Math.exp;
      log = Math.log;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      SpinG2 = (function(_super) {
        __extends(SpinG2, _super);
        function SpinG2(coordinates, modified) {
          if (coordinates === void 0) {
            coordinates = one();
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(SpinG2.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            mustBeNumber_1.default('xy', xy);
            this.modified = this.modified || this.xy !== xy;
            this.coords[COORD_XY] = xy;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SpinG2.prototype, "α", {
          get: function() {
            return this.coords[COORD_ALPHA];
          },
          set: function(α) {
            mustBeNumber_1.default('α', α);
            this.modified = this.modified || this.α !== α;
            this.coords[COORD_ALPHA] = α;
          },
          enumerable: true,
          configurable: true
        });
        SpinG2.prototype.add = function(spinor, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('spinor', spinor);
          mustBeNumber_1.default('α', α);
          this.xy += spinor.xy * α;
          this.α += spinor.α * α;
          return this;
        };
        SpinG2.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.xy = a.xy + b.xy;
          return this;
        };
        SpinG2.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          return this;
        };
        SpinG2.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        SpinG2.prototype.adj = function() {
          throw new Error('TODO: SpinG2.adj');
        };
        SpinG2.prototype.angle = function() {
          return this.log().grade(2);
        };
        SpinG2.prototype.clone = function() {
          return SpinG2.copy(this);
        };
        SpinG2.prototype.conj = function() {
          this.xy = -this.xy;
          return this;
        };
        SpinG2.prototype.copy = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.xy = mustBeNumber_1.default('spinor.xy', spinor.xy);
          this.α = mustBeNumber_1.default('spinor.α', spinor.α);
          return this;
        };
        SpinG2.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        SpinG2.prototype.copySpinor = function(spinor) {
          return this.copy(spinor);
        };
        SpinG2.prototype.copyVector = function(vector) {
          return this.zero();
        };
        SpinG2.prototype.cos = function() {
          throw new Error("SpinG2.cos");
        };
        SpinG2.prototype.cosh = function() {
          throw new Error("SpinG2.cosh");
        };
        SpinG2.prototype.div = function(s) {
          return this.div2(this, s);
        };
        SpinG2.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.xy;
          var b0 = b.α;
          var b1 = b.xy;
          var quadB = quadSpinorE2_1.default(b);
          this.α = (a0 * b0 + a1 * b1) / quadB;
          this.xy = (a1 * b0 - a0 * b1) / quadB;
          return this;
        };
        SpinG2.prototype.divByScalar = function(α) {
          this.xy /= α;
          this.α /= α;
          return this;
        };
        SpinG2.prototype.exp = function() {
          var w = this.α;
          var z = this.xy;
          var expW = exp(w);
          var φ = sqrt(z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.xy = z * s;
          return this;
        };
        SpinG2.prototype.inv = function() {
          this.conj();
          this.divByScalar(this.squaredNormSansUnits());
          return this;
        };
        SpinG2.prototype.lco = function(rhs) {
          return this.lco2(this, rhs);
        };
        SpinG2.prototype.lco2 = function(a, b) {
          return this;
        };
        SpinG2.prototype.lerp = function(target, α) {
          var R2 = SpinG2.copy(target);
          var R1 = this.clone();
          var R = R2.mul(R1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        SpinG2.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        SpinG2.prototype.log = function() {
          var w = this.α;
          var z = this.xy;
          var bb = z * z;
          var R2 = sqrt(bb);
          var R0 = abs(w);
          var R = sqrt(w * w + bb);
          this.α = log(R);
          var f = atan2(R2, R0) / R2;
          this.xy = z * f;
          return this;
        };
        SpinG2.prototype.magnitude = function() {
          return this.norm();
        };
        SpinG2.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        SpinG2.prototype.mul = function(s) {
          return this.mul2(this, s);
        };
        SpinG2.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.xy;
          var b0 = b.α;
          var b1 = b.xy;
          this.α = a0 * b0 - a1 * b1;
          this.xy = a0 * b1 + a1 * b0;
          return this;
        };
        SpinG2.prototype.neg = function() {
          this.α = -this.α;
          this.xy = -this.xy;
          return this;
        };
        SpinG2.prototype.norm = function() {
          var norm = this.magnitudeSansUnits();
          return this.zero().addScalar(norm);
        };
        SpinG2.prototype.direction = function() {
          var modulus = this.magnitudeSansUnits();
          this.xy = this.xy / modulus;
          this.α = this.α / modulus;
          return this;
        };
        SpinG2.prototype.one = function() {
          this.α = 1;
          this.xy = 0;
          return this;
        };
        SpinG2.prototype.pow = function() {
          throw new Error("SpinG2.pow");
        };
        SpinG2.prototype.quad = function() {
          return this.squaredNorm();
        };
        SpinG2.prototype.sin = function() {
          throw new Error("SpinG2.sin");
        };
        SpinG2.prototype.sinh = function() {
          throw new Error("SpinG2.sinh");
        };
        SpinG2.prototype.squaredNorm = function() {
          var squaredNorm = this.squaredNormSansUnits();
          return this.zero().addScalar(squaredNorm);
        };
        SpinG2.prototype.squaredNormSansUnits = function() {
          return quadSpinorE2_1.default(this);
        };
        SpinG2.prototype.rco = function(rhs) {
          return this.rco2(this, rhs);
        };
        SpinG2.prototype.rco2 = function(a, b) {
          return this;
        };
        SpinG2.prototype.rev = function() {
          this.xy *= -1;
          return this;
        };
        SpinG2.prototype.reflect = function(n) {
          var w = this.α;
          var β = this.xy;
          var nx = n.x;
          var ny = n.y;
          var nn = nx * nx + ny * ny;
          this.α = nn * w;
          this.xy = -nn * β;
          return this;
        };
        SpinG2.prototype.rotate = function(rotor) {
          console.warn("SpinG2.rotate is not implemented");
          return this;
        };
        SpinG2.prototype.rotorFromDirections = function(a, b) {
          if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
            return this;
          } else {}
        };
        SpinG2.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.xy = -B.xy * s;
          this.α = cos(φ);
          return this;
        };
        SpinG2.prototype.scp = function(rhs) {
          return this.scp2(this, rhs);
        };
        SpinG2.prototype.scp2 = function(a, b) {
          return this;
        };
        SpinG2.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.xy *= α;
          this.α *= α;
          return this;
        };
        SpinG2.prototype.slerp = function(target, α) {
          var R2 = SpinG2.copy(target);
          var R1 = this.clone();
          var R = R2.mul(R1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        SpinG2.prototype.sub = function(s, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('s', s);
          mustBeNumber_1.default('α', α);
          this.xy -= s.xy * α;
          this.α -= s.α * α;
          return this;
        };
        SpinG2.prototype.sub2 = function(a, b) {
          this.xy = a.xy - b.xy;
          this.α = a.α - b.α;
          return this;
        };
        SpinG2.prototype.spinor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var bx = b.x;
          var by = b.y;
          this.α = dotVectorCartesianE2_1.default(ax, ay, bx, by);
          this.xy = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
          return this;
        };
        SpinG2.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.xy = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.xy = 0;
              }
          }
          return this;
        };
        SpinG2.prototype.toExponential = function() {
          return this.toString();
        };
        SpinG2.prototype.toFixed = function(digits) {
          return this.toString();
        };
        SpinG2.prototype.toString = function() {
          return "SpinG2({β: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG2.prototype.ext = function(rhs) {
          return this.ext2(this, rhs);
        };
        SpinG2.prototype.ext2 = function(a, b) {
          return this;
        };
        SpinG2.prototype.zero = function() {
          this.α = 0;
          this.xy = 0;
          return this;
        };
        SpinG2.copy = function(spinor) {
          return new SpinG2().copy(spinor);
        };
        SpinG2.lerp = function(a, b, α) {
          return SpinG2.copy(a).lerp(b, α);
        };
        SpinG2.rotorFromDirections = function(a, b) {
          return new SpinG2().rotorFromDirections(a, b);
        };
        return SpinG2;
      })(VectorN_1.default);
      exports_1("default", SpinG2);
    }
  };
});

System.register("davinci-eight/models/ModelE2.js", ["../checks/mustBeString", "../math/G2", "../math/R2", "../math/SpinG2", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeString_1,
      G2_1,
      R2_1,
      SpinG2_1,
      readOnly_1,
      Shareable_1;
  var ModelE2;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(SpinG2_1_1) {
      SpinG2_1 = SpinG2_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ModelE2 = (function(_super) {
        __extends(ModelE2, _super);
        function ModelE2(type) {
          if (type === void 0) {
            type = 'ModelE2';
          }
          _super.call(this, mustBeString_1.default('type', type));
          this._position = new G2_1.default().zero();
          this._attitude = new G2_1.default().zero().addScalar(1);
          this._posCache = new R2_1.default();
          this._attCache = new SpinG2_1.default();
          this._position.modified = true;
          this._attitude.modified = true;
        }
        ModelE2.prototype.destructor = function() {
          this._position = void 0;
          this._attitude = void 0;
        };
        Object.defineProperty(ModelE2.prototype, "R", {
          get: function() {
            return this._attitude;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE2.PROP_ATTITUDE).message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ModelE2.prototype, "X", {
          get: function() {
            return this._position;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE2.PROP_POSITION).message);
          },
          enumerable: true,
          configurable: true
        });
        ModelE2.prototype.getProperty = function(name) {
          switch (name) {
            case ModelE2.PROP_ATTITUDE:
              {
                return this._attCache.copy(this._attitude).coords;
              }
              break;
            case ModelE2.PROP_POSITION:
              {
                return this._posCache.copy(this._position).coords;
              }
              break;
            default:
              {
                console.warn("ModelE2.getProperty " + name);
                return void 0;
              }
          }
        };
        ModelE2.prototype.setProperty = function(name, data) {
          switch (name) {
            case ModelE2.PROP_ATTITUDE:
              {
                this._attCache.coords = data;
                this._attitude.copySpinor(this._attCache);
              }
              break;
            case ModelE2.PROP_POSITION:
              {
                this._posCache.coords = data;
                this._position.copyVector(this._posCache);
              }
              break;
            default:
              {
                console.warn("ModelE2.setProperty " + name);
              }
          }
          return this;
        };
        ModelE2.PROP_ATTITUDE = 'R';
        ModelE2.PROP_POSITION = 'X';
        return ModelE2;
      })(Shareable_1.default);
      exports_1("default", ModelE2);
    }
  };
});

System.register("davinci-eight/scene/initWebGL.js", ["../checks/isDefined"], function(exports_1) {
  var isDefined_1;
  function initWebGL(canvas, attributes) {
    if (isDefined_1.default(canvas)) {
      var context;
      try {
        context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
      } catch (e) {}
      if (context) {
        return context;
      } else {
        throw new Error("Unable to initialize WebGL. Your browser may not support it.");
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", initWebGL);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/utils/getCanvasElementById.js", ["../checks/mustBeString", "../checks/mustBeObject"], function(exports_1) {
  var mustBeString_1,
      mustBeObject_1;
  function getCanvasElementById(elementId, dom) {
    if (dom === void 0) {
      dom = window.document;
    }
    mustBeString_1.default('elementId', elementId);
    mustBeObject_1.default('document', dom);
    var element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
      return element;
    } else {
      throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
  }
  exports_1("default", getCanvasElementById);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/collections/NumberIUnknownMap.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var LOGGING_NAME,
      NumberIUnknownMap;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'NumberIUnknownMap';
      NumberIUnknownMap = (function(_super) {
        __extends(NumberIUnknownMap, _super);
        function NumberIUnknownMap() {
          _super.call(this, LOGGING_NAME);
          this._elements = {};
        }
        NumberIUnknownMap.prototype.destructor = function() {
          this.forEach(function(key, value) {
            if (value) {
              value.release();
            }
          });
          this._elements = void 0;
        };
        NumberIUnknownMap.prototype.exists = function(key) {
          var element = this._elements[key];
          return element ? true : false;
        };
        NumberIUnknownMap.prototype.get = function(key) {
          var element = this.getWeakRef(key);
          if (element) {
            element.addRef();
          }
          return element;
        };
        NumberIUnknownMap.prototype.getWeakRef = function(index) {
          return this._elements[index];
        };
        NumberIUnknownMap.prototype.put = function(key, value) {
          if (value) {
            value.addRef();
          }
          this.putWeakRef(key, value);
        };
        NumberIUnknownMap.prototype.putWeakRef = function(key, value) {
          var elements = this._elements;
          var existing = elements[key];
          if (existing) {
            existing.release();
          }
          elements[key] = value;
        };
        NumberIUnknownMap.prototype.forEach = function(callback) {
          var keys = this.keys;
          for (var i = 0,
              iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var value = this._elements[key];
            callback(key, value);
          }
        };
        Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
          get: function() {
            return Object.keys(this._elements).map(function(keyString) {
              return parseFloat(keyString);
            });
          },
          enumerable: true,
          configurable: true
        });
        NumberIUnknownMap.prototype.remove = function(key) {
          this.put(key, void 0);
          delete this._elements[key];
        };
        return NumberIUnknownMap;
      })(Shareable_1.default);
      exports_1("default", NumberIUnknownMap);
    }
  };
});

System.register("davinci-eight/utils/animation.js", ["../checks/expectArg"], function(exports_1) {
  var expectArg_1;
  function defaultSetUp() {}
  function defaultTearDown(animateException) {
    if (animateException) {
      var message = "Exception raised during animate function: " + animateException;
      console.warn(message);
    }
  }
  function defaultTerminate(time) {
    return false;
  }
  function animation(animate, options) {
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;
    options = options || {};
    var $window = expectArg_1.default('options.window', options.window || window).toNotBeNull().value;
    var setUp = expectArg_1.default('options.setUp', options.setUp || defaultSetUp).value;
    var tearDown = expectArg_1.default('options.tearDown', options.tearDown || defaultTearDown).value;
    var terminate = expectArg_1.default('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
    var stopSignal = false;
    var startTime;
    var elapsed = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID = null;
    var animateException;
    var state = STATE_INITIAL;
    var frameRequestCallback = function(timestamp) {
      if (startTime) {
        elapsed = elapsed + timestamp - startTime;
      }
      startTime = timestamp;
      if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
        stopSignal = false;
        $window.cancelAnimationFrame(requestID);
        if (publicAPI.isRunning) {
          state = STATE_PAUSED;
          startTime = void 0;
        } else {
          console.error("stopSignal received while not running.");
        }
        $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
        try {
          tearDown(animateException);
        } catch (e) {
          console.warn("Exception raised during tearDown function: " + e);
        }
      } else {
        requestID = $window.requestAnimationFrame(frameRequestCallback);
        try {
          animate(elapsed / MILLIS_PER_SECOND);
        } catch (e) {
          animateException = e;
          stopSignal = true;
        }
      }
    };
    var onDocumentKeyDown = function(event) {
      if (event.keyCode === 27) {
        stopSignal = true;
        event.preventDefault();
      }
    };
    var publicAPI = {
      start: function() {
        if (!publicAPI.isRunning) {
          setUp();
          $window.document.addEventListener('keydown', onDocumentKeyDown, false);
          state = STATE_RUNNING;
          requestID = $window.requestAnimationFrame(frameRequestCallback);
        } else {
          throw new Error("The `start` method may only be called when not running.");
        }
      },
      stop: function() {
        if (publicAPI.isRunning) {
          stopSignal = true;
        } else {
          throw new Error("The `stop` method may only be called when running.");
        }
      },
      reset: function() {
        if (publicAPI.isPaused) {
          startTime = void 0;
          elapsed = 0;
          state = STATE_INITIAL;
        } else {
          throw new Error("The `reset` method may only be called when paused.");
        }
      },
      get time() {
        return elapsed / MILLIS_PER_SECOND;
      },
      lap: function() {
        if (publicAPI.isRunning) {} else {
          throw new Error("The `lap` method may only be called when running.");
        }
      },
      get isRunning() {
        return state === STATE_RUNNING;
      },
      get isPaused() {
        return state === STATE_PAUSED;
      }
    };
    return publicAPI;
  }
  exports_1("default", animation);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/visual/vector.js", ["../math/G3"], function(exports_1) {
  var G3_1;
  function vector(x, y, z) {
    var v = new G3_1.default();
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
  }
  exports_1("default", vector);
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/ConeGeometry.js", ["../geometries/AxialGeometry", "../core/GraphicsProgramSymbols", "../topologies/GridTopology", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialGeometry_1,
      GraphicsProgramSymbols_1,
      GridTopology_1,
      R2_1,
      R3_1;
  var ConeGeometry;
  return {
    setters: [function(AxialGeometry_1_1) {
      AxialGeometry_1 = AxialGeometry_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      ConeGeometry = (function(_super) {
        __extends(ConeGeometry, _super);
        function ConeGeometry(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.radius = 1;
          this.height = 1;
          this.thetaSegments = 16;
        }
        ConeGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        ConeGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        ConeGeometry.prototype.toPrimitives = function() {
          var topo = new GridTopology_1.default(this.thetaSegments, 1);
          var uLength = topo.uLength;
          var uSegments = uLength - 1;
          var vLength = topo.vLength;
          var vSegments = vLength - 1;
          var a = R3_1.default.copy(this.sliceStart).direction().scale(this.radius);
          var b = new R3_1.default().cross2(a, this.axis).direction().scale(this.radius);
          var h = R3_1.default.copy(this.axis).scale(this.height);
          for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var u = uIndex / uSegments;
            var theta = this.sliceAngle * u;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            for (var vIndex = 0; vIndex < vLength; vIndex++) {
              var v = vIndex / vSegments;
              var position = new R3_1.default().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
              var peak = R3_1.default.copy(h).sub(position);
              var normal = new R3_1.default().cross2(peak, position).cross(peak).direction();
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.add(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        ConeGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return ConeGeometry;
      })(AxialGeometry_1.default);
      exports_1("default", ConeGeometry);
    }
  };
});

System.register("davinci-eight/geometries/CylinderGeometry.js", ["../geometries/AxialGeometry", "../core/GraphicsProgramSymbols", "../topologies/GridTopology", "../math/SpinG3", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialGeometry_1,
      GraphicsProgramSymbols_1,
      GridTopology_1,
      SpinG3_1,
      R2_1,
      R3_1;
  var CylinderGeometry;
  return {
    setters: [function(AxialGeometry_1_1) {
      AxialGeometry_1 = AxialGeometry_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      CylinderGeometry = (function(_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.radius = 1;
          this.height = 1;
          this.thetaSegments = 16;
        }
        CylinderGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        CylinderGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        CylinderGeometry.prototype.toPrimitives = function() {
          var uSegments = this.thetaSegments;
          var vSegments = 1;
          var topo = new GridTopology_1.default(uSegments, vSegments);
          var axis = this.axis;
          var generator = SpinG3_1.default.dual(axis);
          for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
            var u = uIndex / uSegments;
            var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
            for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
              var v = vIndex / vSegments;
              var normal = R3_1.default.copy(this.sliceStart).rotate(rotor);
              var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.add(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        CylinderGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return CylinderGeometry;
      })(AxialGeometry_1.default);
      exports_1("default", CylinderGeometry);
    }
  };
});

System.register("davinci-eight/geometries/AxialGeometry.js", ["../math/CartesianE3", "../geometries/Geometry", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var CartesianE3_1,
      Geometry_1,
      mustBeNumber_1,
      mustBeObject_1,
      R3_1;
  var AxialGeometry;
  return {
    setters: [function(CartesianE3_1_1) {
      CartesianE3_1 = CartesianE3_1_1;
    }, function(Geometry_1_1) {
      Geometry_1 = Geometry_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      AxialGeometry = (function(_super) {
        __extends(AxialGeometry, _super);
        function AxialGeometry(axis, sliceStart) {
          _super.call(this);
          this._sliceAngle = 2 * Math.PI;
          this.setAxis(axis);
          if (sliceStart) {
            this.setSliceStart(sliceStart);
          } else {
            this.setSliceStart(R3_1.default.random().cross(axis));
          }
        }
        Object.defineProperty(AxialGeometry.prototype, "axis", {
          get: function() {
            return this._axis;
          },
          set: function(axis) {
            this.setAxis(axis);
          },
          enumerable: true,
          configurable: true
        });
        AxialGeometry.prototype.setAxis = function(axis) {
          mustBeObject_1.default('axis', axis);
          this._axis = CartesianE3_1.default.direction(axis);
          this.setSliceStart(R3_1.default.random().cross(this._axis));
          return this;
        };
        Object.defineProperty(AxialGeometry.prototype, "sliceAngle", {
          get: function() {
            return this._sliceAngle;
          },
          set: function(sliceAngle) {
            mustBeNumber_1.default('sliceAngle', sliceAngle);
            this._sliceAngle = sliceAngle;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AxialGeometry.prototype, "sliceStart", {
          get: function() {
            return this._sliceStart;
          },
          set: function(sliceStart) {
            this.setSliceStart(sliceStart);
          },
          enumerable: true,
          configurable: true
        });
        AxialGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        AxialGeometry.prototype.setSliceStart = function(sliceStart) {
          mustBeObject_1.default('sliceStart', sliceStart);
          this._sliceStart = CartesianE3_1.default.direction(sliceStart);
        };
        AxialGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return AxialGeometry;
      })(Geometry_1.default);
      exports_1("default", AxialGeometry);
    }
  };
});

System.register("davinci-eight/geometries/RingGeometry.js", ["../core/GraphicsProgramSymbols", "../topologies/GridTopology", "../geometries/AxialGeometry", "../math/R2", "../math/G3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramSymbols_1,
      GridTopology_1,
      AxialGeometry_1,
      R2_1,
      G3_1;
  var RingGeometry;
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(AxialGeometry_1_1) {
      AxialGeometry_1 = AxialGeometry_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }],
    execute: function() {
      RingGeometry = (function(_super) {
        __extends(RingGeometry, _super);
        function RingGeometry(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.innerRadius = 0;
          this.outerRadius = 1;
          this.thetaSegments = 16;
        }
        RingGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        RingGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        RingGeometry.prototype.toPrimitives = function() {
          var uSegments = this.thetaSegments;
          var vSegments = 1;
          var topo = new GridTopology_1.default(uSegments, vSegments);
          var a = this.outerRadius;
          var b = this.innerRadius;
          var axis = G3_1.default.fromVector(this.axis);
          var start = G3_1.default.fromVector(this.sliceStart);
          var generator = new G3_1.default().dual(axis);
          for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
            var u = uIndex / uSegments;
            var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
            for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
              var v = vIndex / vSegments;
              var position = start.clone().rotate(rotor).scale(b + (a - b) * v);
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.addVector(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = axis;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        RingGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return RingGeometry;
      })(AxialGeometry_1.default);
      exports_1("default", RingGeometry);
    }
  };
});

System.register("davinci-eight/geometries/ArrowGeometry.js", ["../geometries/ConeGeometry", "../geometries/CylinderGeometry", "../geometries/AxialGeometry", "../geometries/RingGeometry", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ConeGeometry_1,
      CylinderGeometry_1,
      AxialGeometry_1,
      RingGeometry_1,
      R3_1;
  var ArrowGeometry;
  return {
    setters: [function(ConeGeometry_1_1) {
      ConeGeometry_1 = ConeGeometry_1_1;
    }, function(CylinderGeometry_1_1) {
      CylinderGeometry_1 = CylinderGeometry_1_1;
    }, function(AxialGeometry_1_1) {
      AxialGeometry_1 = AxialGeometry_1_1;
    }, function(RingGeometry_1_1) {
      RingGeometry_1 = RingGeometry_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      ArrowGeometry = (function(_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.heightCone = 0.20;
          this.radiusCone = 0.08;
          this.radiusShaft = 0.01;
          this.thetaSegments = 16;
        }
        ArrowGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        ArrowGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        ArrowGeometry.prototype.toPrimitives = function() {
          var heightShaft = 1 - this.heightCone;
          var back = R3_1.default.copy(this.axis).scale(-1);
          var neck = R3_1.default.copy(this.axis).scale(heightShaft).add(this.position);
          var tail = R3_1.default.copy(this.position);
          var cone = new ConeGeometry_1.default(this.axis, this.sliceStart);
          cone.radius = this.radiusCone;
          cone.height = this.heightCone;
          cone.setPosition(neck);
          cone.axis = this.axis;
          cone.sliceAngle = this.sliceAngle;
          cone.thetaSegments = this.thetaSegments;
          cone.useTextureCoords = this.useTextureCoords;
          var disc = new RingGeometry_1.default(back, this.sliceStart);
          disc.innerRadius = this.radiusShaft;
          disc.outerRadius = this.radiusCone;
          disc.setPosition(neck);
          disc.sliceAngle = -this.sliceAngle;
          disc.thetaSegments = this.thetaSegments;
          disc.useTextureCoords = this.useTextureCoords;
          var shaft = new CylinderGeometry_1.default(this.axis, this.sliceStart);
          shaft.radius = this.radiusShaft;
          shaft.height = heightShaft;
          shaft.setPosition(tail);
          shaft.sliceAngle = this.sliceAngle;
          shaft.thetaSegments = this.thetaSegments;
          shaft.useTextureCoords = this.useTextureCoords;
          var plug = new RingGeometry_1.default(back, this.sliceStart);
          plug.innerRadius = 0;
          plug.outerRadius = this.radiusShaft;
          plug.setPosition(tail);
          plug.sliceAngle = -this.sliceAngle;
          plug.thetaSegments = this.thetaSegments;
          plug.useTextureCoords = this.useTextureCoords;
          return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function(a, b) {
            return a.concat(b);
          }, []);
        };
        ArrowGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return ArrowGeometry;
      })(AxialGeometry_1.default);
      exports_1("default", ArrowGeometry);
    }
  };
});

System.register("davinci-eight/topologies/Topology.js", ["../geometries/DrawAttribute", "../geometries/DrawPrimitive", "../checks/mustBeInteger", "../geometries/Vertex", "../geometries/dataFromVectorN"], function(exports_1) {
  var DrawAttribute_1,
      DrawPrimitive_1,
      mustBeInteger_1,
      Vertex_1,
      dataFromVectorN_1;
  var Topology;
  function attributes(elements, vertices) {
    var attribs = {};
    for (var vertexIndex = 0; vertexIndex < vertices.length; vertexIndex++) {
      var vertex = vertices[vertexIndex];
      var names = Object.keys(vertex.attributes);
      for (var namesIndex = 0; namesIndex < names.length; namesIndex++) {
        var name = names[namesIndex];
        var data = dataFromVectorN_1.default(vertex.attributes[name]);
        var size = data.length;
        var attrib = attribs[name];
        if (!attrib) {
          attrib = attribs[name] = new DrawAttribute_1.default([], size);
        }
        for (var coordIndex = 0; coordIndex < size; coordIndex++) {
          attrib.values.push(data[coordIndex]);
        }
      }
    }
    return attribs;
  }
  return {
    setters: [function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(dataFromVectorN_1_1) {
      dataFromVectorN_1 = dataFromVectorN_1_1;
    }],
    execute: function() {
      Topology = (function() {
        function Topology(mode, numVertices) {
          this.mode = mustBeInteger_1.default('mode', mode);
          mustBeInteger_1.default('numVertices', numVertices);
          this.vertices = [];
          for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex_1.default());
          }
        }
        Topology.prototype.toDrawPrimitive = function() {
          return new DrawPrimitive_1.default(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return Topology;
      })();
      exports_1("default", Topology);
    }
  };
});

System.register("davinci-eight/topologies/MeshTopology.js", ["../topologies/Topology"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Topology_1;
  var MeshTopology;
  return {
    setters: [function(Topology_1_1) {
      Topology_1 = Topology_1_1;
    }],
    execute: function() {
      MeshTopology = (function(_super) {
        __extends(MeshTopology, _super);
        function MeshTopology(mode, numVertices) {
          _super.call(this, mode, numVertices);
        }
        return MeshTopology;
      })(Topology_1.default);
      exports_1("default", MeshTopology);
    }
  };
});

System.register("davinci-eight/topologies/GridTopology.js", ["../core/DrawMode", "../checks/isDefined", "../topologies/MeshTopology", "../checks/mustBeArray", "../checks/mustBeInteger", "../i18n/readOnly"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var DrawMode_1,
      isDefined_1,
      MeshTopology_1,
      mustBeArray_1,
      mustBeInteger_1,
      readOnly_1;
  var GridTopology;
  function numPostsForFence(segmentCount) {
    mustBeInteger_1.default('segmentCount', segmentCount);
    return segmentCount + 1;
  }
  function dimensionsForGrid(segmentCounts) {
    mustBeArray_1.default('segmentCounts', segmentCounts);
    return segmentCounts.map(numPostsForFence);
  }
  function numVerticesForGrid(uSegments, vSegments) {
    mustBeInteger_1.default('uSegments', uSegments);
    mustBeInteger_1.default('vSegments', vSegments);
    return dimensionsForGrid([uSegments, vSegments]).reduce(function(a, b) {
      return a * b;
    }, 1);
  }
  function triangleStripForGrid(uSegments, vSegments, elements) {
    elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
    var uLength = numPostsForFence(uSegments);
    var lastVertex = uSegments + uLength * vSegments;
    var eSimple = 2 * uLength * vSegments;
    var j = 0;
    for (var i = 1; i <= eSimple; i += 2) {
      var k = (i - 1) / 2;
      elements[j] = (i - 1) / 2;
      elements[j + 1] = elements[j] + uLength;
      if (elements[j + 1] % uLength === uSegments) {
        if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
          elements[j + 2] = elements[j + 1];
          elements[j + 3] = (1 + i) / 2;
          j += 2;
        }
      }
      j += 2;
    }
    return elements;
  }
  return {
    setters: [function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(MeshTopology_1_1) {
      MeshTopology_1 = MeshTopology_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      GridTopology = (function(_super) {
        __extends(GridTopology, _super);
        function GridTopology(uSegments, vSegments) {
          _super.call(this, DrawMode_1.default.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments));
          this.elements = triangleStripForGrid(uSegments, vSegments);
          this._uSegments = uSegments;
          this._vSegments = vSegments;
        }
        Object.defineProperty(GridTopology.prototype, "uSegments", {
          get: function() {
            return this._uSegments;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uSegments').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "uLength", {
          get: function() {
            return numPostsForFence(this._uSegments);
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uLength').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vSegments", {
          get: function() {
            return this._vSegments;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vSegments').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vLength", {
          get: function() {
            return numPostsForFence(this._vSegments);
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vLength').message);
          },
          enumerable: true,
          configurable: true
        });
        GridTopology.prototype.vertex = function(uIndex, vIndex) {
          mustBeInteger_1.default('uIndex', uIndex);
          mustBeInteger_1.default('vIndex', vIndex);
          return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTopology;
      })(MeshTopology_1.default);
      exports_1("default", GridTopology);
    }
  };
});

System.register("davinci-eight/geometries/CuboidGeometry.js", ["../math/Euclidean3", "../topologies/GridTopology", "../geometries/Geometry", "../core/GraphicsProgramSymbols", "../checks/mustBeNumber", "../math/R3", "../math/R2"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Euclidean3_1,
      GridTopology_1,
      Geometry_1,
      GraphicsProgramSymbols_1,
      mustBeNumber_1,
      R3_1,
      R2_1;
  var CuboidGeometry;
  function side(basis, uSegments, vSegments) {
    var normal = R3_1.default.copy(basis[0]).cross(basis[1]).direction();
    var aNeg = R3_1.default.copy(basis[0]).scale(-0.5);
    var aPos = R3_1.default.copy(basis[0]).scale(+0.5);
    var bNeg = R3_1.default.copy(basis[1]).scale(-0.5);
    var bPos = R3_1.default.copy(basis[1]).scale(+0.5);
    var cPos = R3_1.default.copy(basis[2]).scale(+0.5);
    var side = new GridTopology_1.default(uSegments, vSegments);
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
      for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
        var u = uIndex / uSegments;
        var v = vIndex / vSegments;
        var a = R3_1.default.copy(aNeg).lerp(aPos, u);
        var b = R3_1.default.copy(bNeg).lerp(bPos, v);
        var vertex = side.vertex(uIndex, vIndex);
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(a).add(b).add(cPos);
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
      }
    }
    return side;
  }
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(Geometry_1_1) {
      Geometry_1 = Geometry_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }],
    execute: function() {
      CuboidGeometry = (function(_super) {
        __extends(CuboidGeometry, _super);
        function CuboidGeometry() {
          _super.call(this);
          this.iSegments = 1;
          this.jSegments = 1;
          this.kSegments = 1;
          this._a = R3_1.default.copy(Euclidean3_1.default.e1);
          this._b = R3_1.default.copy(Euclidean3_1.default.e2);
          this._c = R3_1.default.copy(Euclidean3_1.default.e3);
          this.sides = [];
        }
        Object.defineProperty(CuboidGeometry.prototype, "width", {
          get: function() {
            return this._a.magnitude();
          },
          set: function(width) {
            mustBeNumber_1.default('width', width);
            this._a.direction().scale(width);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "height", {
          get: function() {
            return this._b.magnitude();
          },
          set: function(height) {
            mustBeNumber_1.default('height', height);
            this._b.direction().scale(height);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "depth", {
          get: function() {
            return this._c.magnitude();
          },
          set: function(depth) {
            mustBeNumber_1.default('depth', depth);
            this._c.direction().scale(depth);
          },
          enumerable: true,
          configurable: true
        });
        CuboidGeometry.prototype.regenerate = function() {
          this.sides = [];
          this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
          this.sides.push(side([R3_1.default.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
          this.sides.push(side([this._c, this._b, R3_1.default.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
          this.sides.push(side([R3_1.default.copy(this._a).scale(-1), this._b, R3_1.default.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
          this.sides.push(side([this._a, R3_1.default.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
          this.sides.push(side([this._a, this._c, R3_1.default.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        CuboidGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        CuboidGeometry.prototype.toPrimitives = function() {
          this.regenerate();
          return this.sides.map(function(side) {
            return side.toDrawPrimitive();
          });
        };
        CuboidGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return CuboidGeometry;
      })(Geometry_1.default);
      exports_1("default", CuboidGeometry);
    }
  };
});

System.register("davinci-eight/geometries/CylinderSimplexGeometry.js", ["../geometries/arc3", "../geometries/SliceSimplexGeometry", "../math/SpinG3", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var arc3_1,
      SliceSimplexGeometry_1,
      SpinG3_1,
      R2_1,
      R3_1;
  var CylinderSimplexGeometry;
  function computeVertices(radius, height, axis, start, angle, generator, heightSegments, thetaSegments, points, vertices, uvs) {
    var begin = R3_1.default.copy(start).scale(radius);
    var halfHeight = R3_1.default.copy(axis).scale(0.5 * height);
    var stepH = R3_1.default.copy(axis).direction().scale(height / heightSegments);
    for (var i = 0; i <= heightSegments; i++) {
      var dispH = R3_1.default.copy(stepH).scale(i).sub(halfHeight);
      var verticesRow = [];
      var uvsRow = [];
      var v = (heightSegments - i) / heightSegments;
      var arcPoints = arc3_1.default(begin, angle, generator, thetaSegments);
      for (var j = 0,
          jLength = arcPoints.length; j < jLength; j++) {
        var point = arcPoints[j].add(dispH);
        var u = j / thetaSegments;
        points.push(point);
        verticesRow.push(points.length - 1);
        uvsRow.push(new R2_1.default([u, v]));
      }
      vertices.push(verticesRow);
      uvs.push(uvsRow);
    }
  }
  return {
    setters: [function(arc3_1_1) {
      arc3_1 = arc3_1_1;
    }, function(SliceSimplexGeometry_1_1) {
      SliceSimplexGeometry_1 = SliceSimplexGeometry_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      CylinderSimplexGeometry = (function(_super) {
        __extends(CylinderSimplexGeometry, _super);
        function CylinderSimplexGeometry(radius, height, axis, openTop, openBottom) {
          if (radius === void 0) {
            radius = 1;
          }
          if (height === void 0) {
            height = 1;
          }
          if (axis === void 0) {
            axis = R3_1.default.e2;
          }
          if (openTop === void 0) {
            openTop = false;
          }
          if (openBottom === void 0) {
            openBottom = false;
          }
          _super.call(this, axis, void 0, void 0);
          this.radius = radius;
          this.height = height;
          this.openTop = openTop;
          this.openBottom = openBottom;
          this.setModified(true);
        }
        CylinderSimplexGeometry.prototype.regenerate = function() {
          this.data = [];
          var radius = this.radius;
          var height = this.height;
          var heightSegments = this.flatSegments;
          var thetaSegments = this.curvedSegments;
          var generator = SpinG3_1.default.dual(this.axis);
          var heightHalf = height / 2;
          var points = [];
          var vertices = [];
          var uvs = [];
          computeVertices(radius, this.height, this.axis, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs);
          var na;
          var nb;
          for (var j = 0; j < thetaSegments; j++) {
            if (radius !== 0) {
              na = R3_1.default.copy(points[vertices[0][j]]);
              nb = R3_1.default.copy(points[vertices[0][j + 1]]);
            } else {
              na = R3_1.default.copy(points[vertices[1][j]]);
              nb = R3_1.default.copy(points[vertices[1][j + 1]]);
            }
            na.setY(0).direction();
            nb.setY(0).direction();
            for (var i = 0; i < heightSegments; i++) {
              var v1 = vertices[i][j];
              var v2 = vertices[i + 1][j];
              var v3 = vertices[i + 1][j + 1];
              var v4 = vertices[i][j + 1];
              var n1 = na.clone();
              var n2 = na.clone();
              var n3 = nb.clone();
              var n4 = nb.clone();
              var uv1 = uvs[i][j].clone();
              var uv2 = uvs[i + 1][j].clone();
              var uv3 = uvs[i + 1][j + 1].clone();
              var uv4 = uvs[i][j + 1].clone();
              this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
              this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
            }
          }
          if (!this.openTop && radius > 0) {
            points.push(R3_1.default.copy(this.axis).scale(heightHalf));
            for (var j = 0; j < thetaSegments; j++) {
              var v1 = vertices[heightSegments][j + 1];
              var v2 = points.length - 1;
              var v3 = vertices[heightSegments][j];
              var n1 = R3_1.default.copy(this.axis);
              var n2 = R3_1.default.copy(this.axis);
              var n3 = R3_1.default.copy(this.axis);
              var uv1 = uvs[heightSegments][j + 1].clone();
              var uv2 = new R2_1.default([uv1.x, 1]);
              var uv3 = uvs[heightSegments][j].clone();
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
          if (!this.openBottom && radius > 0) {
            points.push(R3_1.default.copy(this.axis).scale(-heightHalf));
            for (var j = 0; j < thetaSegments; j++) {
              var v1 = vertices[0][j];
              var v2 = points.length - 1;
              var v3 = vertices[0][j + 1];
              var n1 = R3_1.default.copy(this.axis).scale(-1);
              var n2 = R3_1.default.copy(this.axis).scale(-1);
              var n3 = R3_1.default.copy(this.axis).scale(-1);
              var uv1 = uvs[0][j].clone();
              var uv2 = new R2_1.default([uv1.x, 1]);
              var uv3 = uvs[0][j + 1].clone();
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
          this.setModified(false);
        };
        return CylinderSimplexGeometry;
      })(SliceSimplexGeometry_1.default);
      exports_1("default", CylinderSimplexGeometry);
    }
  };
});

System.register("davinci-eight/collections/IUnknownArray.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var IUnknownArray;
  function transferOwnership(data) {
    if (data) {
      var result = new IUnknownArray(data);
      for (var i = 0,
          iLength = data.length; i < iLength; i++) {
        var element = data[i];
        if (element) {
          element.release();
        }
      }
      return result;
    } else {
      return void 0;
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      IUnknownArray = (function(_super) {
        __extends(IUnknownArray, _super);
        function IUnknownArray(elements) {
          if (elements === void 0) {
            elements = [];
          }
          _super.call(this, 'IUnknownArray');
          this._elements = elements;
          for (var i = 0,
              l = this._elements.length; i < l; i++) {
            this._elements[i].addRef();
          }
        }
        IUnknownArray.prototype.destructor = function() {
          for (var i = 0,
              l = this._elements.length; i < l; i++) {
            this._elements[i].release();
          }
          this._elements = void 0;
          _super.prototype.destructor.call(this);
        };
        IUnknownArray.prototype.findOne = function(match) {
          var elements = this._elements;
          for (var i = 0,
              iLength = elements.length; i < iLength; i++) {
            var candidate = elements[i];
            if (match(candidate)) {
              candidate.addRef();
              return candidate;
            }
          }
          return void 0;
        };
        IUnknownArray.prototype.get = function(index) {
          var element = this.getWeakRef(index);
          if (element) {
            element.addRef();
          }
          return element;
        };
        IUnknownArray.prototype.getWeakRef = function(index) {
          return this._elements[index];
        };
        IUnknownArray.prototype.indexOf = function(searchElement, fromIndex) {
          return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(IUnknownArray.prototype, "length", {
          get: function() {
            if (this._elements) {
              return this._elements.length;
            } else {
              console.warn("IUnknownArray is now a zombie, length is undefined");
              return void 0;
            }
          },
          enumerable: true,
          configurable: true
        });
        IUnknownArray.prototype.slice = function(begin, end) {
          return new IUnknownArray(this._elements.slice(begin, end));
        };
        IUnknownArray.prototype.splice = function(index, deleteCount) {
          return transferOwnership(this._elements.splice(index, deleteCount));
        };
        IUnknownArray.prototype.shift = function() {
          return this._elements.shift();
        };
        IUnknownArray.prototype.forEach = function(callback) {
          return this._elements.forEach(callback);
        };
        IUnknownArray.prototype.push = function(element) {
          if (element) {
            element.addRef();
          }
          return this.pushWeakRef(element);
        };
        IUnknownArray.prototype.pushWeakRef = function(element) {
          return this._elements.push(element);
        };
        IUnknownArray.prototype.pop = function() {
          return this._elements.pop();
        };
        IUnknownArray.prototype.unshift = function(element) {
          element.addRef();
          return this.unshiftWeakRef(element);
        };
        IUnknownArray.prototype.unshiftWeakRef = function(element) {
          return this._elements.unshift(element);
        };
        return IUnknownArray;
      })(Shareable_1.default);
      exports_1("default", IUnknownArray);
    }
  };
});

System.register("davinci-eight/scene/PrimitiveBuffer.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var PrimitiveBuffer;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      PrimitiveBuffer = (function(_super) {
        __extends(PrimitiveBuffer, _super);
        function PrimitiveBuffer(dataSource) {
          _super.call(this, 'PrimitiveBuffer');
          this._dataSource = dataSource;
        }
        PrimitiveBuffer.prototype.destructor = function() {
          this.dropBuffer();
          _super.prototype.destructor.call(this);
        };
        PrimitiveBuffer.prototype.contextFree = function(manager) {
          this.dropBuffer();
        };
        PrimitiveBuffer.prototype.contextGain = function(manager) {
          if (!this._dataBuffer) {
            this._dataBuffer = manager.createBufferGeometry(this._dataSource);
          }
        };
        PrimitiveBuffer.prototype.contextLost = function() {
          this.dropBuffer();
        };
        PrimitiveBuffer.prototype.dropBuffer = function() {
          if (this._dataBuffer) {
            this._dataBuffer.release();
            this._dataBuffer = void 0;
          }
        };
        PrimitiveBuffer.prototype.draw = function(program) {
          this._dataBuffer.bind(program);
          this._dataBuffer.draw();
          this._dataBuffer.unbind();
        };
        return PrimitiveBuffer;
      })(Shareable_1.default);
      exports_1("default", PrimitiveBuffer);
    }
  };
});

System.register("davinci-eight/scene/GraphicsBuffers.js", ["../collections/IUnknownArray", "./PrimitiveBuffer", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var IUnknownArray_1,
      PrimitiveBuffer_1,
      readOnly_1,
      Shareable_1;
  var GraphicsBuffers;
  return {
    setters: [function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(PrimitiveBuffer_1_1) {
      PrimitiveBuffer_1 = PrimitiveBuffer_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      GraphicsBuffers = (function(_super) {
        __extends(GraphicsBuffers, _super);
        function GraphicsBuffers(primitives) {
          _super.call(this, 'GraphicsBuffers');
          this.buffers = new IUnknownArray_1.default();
          var iLen = primitives.length;
          for (var i = 0; i < iLen; i++) {
            var dataSource = primitives[i];
            this.buffers.pushWeakRef(new PrimitiveBuffer_1.default(dataSource));
          }
        }
        GraphicsBuffers.prototype.destructor = function() {
          this.buffers.release();
          this.buffers = void 0;
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(GraphicsBuffers.prototype, "length", {
          get: function() {
            return this.buffers.length;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('length').message);
          },
          enumerable: true,
          configurable: true
        });
        GraphicsBuffers.prototype.get = function(index) {
          return this.buffers.get(index);
        };
        GraphicsBuffers.prototype.getWeakRef = function(index) {
          return this.buffers.getWeakRef(index);
        };
        GraphicsBuffers.prototype.contextFree = function(manager) {
          this.buffers.forEach(function(buffer) {
            buffer.contextFree(manager);
          });
        };
        GraphicsBuffers.prototype.contextGain = function(manager) {
          this.buffers.forEach(function(buffer) {
            buffer.contextGain(manager);
          });
        };
        GraphicsBuffers.prototype.contextLost = function() {
          this.buffers.forEach(function(buffer) {
            buffer.contextLost();
          });
        };
        return GraphicsBuffers;
      })(Shareable_1.default);
      exports_1("default", GraphicsBuffers);
    }
  };
});

System.register("davinci-eight/programs/glslAttribType.js", ["../core/GraphicsProgramSymbols", "../checks/mustBeInteger", "../checks/mustBeString"], function(exports_1) {
  var GraphicsProgramSymbols_1,
      mustBeInteger_1,
      mustBeString_1;
  function sizeType(size) {
    mustBeInteger_1.default('size', size);
    switch (size) {
      case 1:
        {
          return 'float';
        }
        break;
      case 2:
        {
          return 'vec2';
        }
        break;
      case 3:
        {
          return 'vec3';
        }
        break;
      case 4:
        {
          return 'vec4';
        }
        break;
      default:
        {
          throw new Error("Can't compute the GLSL attribute type from size " + size);
        }
    }
  }
  function glslAttribType(key, size) {
    mustBeString_1.default('key', key);
    mustBeInteger_1.default('size', size);
    switch (key) {
      case GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR:
        {
          return 'vec3';
        }
        break;
      default:
        {
          return sizeType(size);
        }
    }
  }
  exports_1("default", glslAttribType);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/SmartGraphicsProgram.js", ["../programs/fragmentShader", "../core/ShareableWebGLProgram", "../programs/vertexShader"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var fragmentShader_1,
      ShareableWebGLProgram_1,
      vertexShader_1;
  var SmartGraphicsProgram;
  return {
    setters: [function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }],
    execute: function() {
      SmartGraphicsProgram = (function(_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vLight) {
          _super.call(this, vertexShader_1.default(aParams, uParams, vColor, vLight), fragmentShader_1.default(aParams, uParams, vColor, vLight));
        }
        return SmartGraphicsProgram;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", SmartGraphicsProgram);
    }
  };
});

System.register("davinci-eight/programs/vColorRequired.js", ["../core/GraphicsProgramSymbols"], function(exports_1) {
  var GraphicsProgramSymbols_1;
  function vColorRequired(attributes, uniforms) {
    return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR];
  }
  exports_1("default", vColorRequired);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/programs/vLightRequired.js", ["../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var mustBeDefined_1,
      GraphicsProgramSymbols_1;
  function vLightRequired(attributes, uniforms) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    return !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
  }
  exports_1("default", vLightRequired);
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/programs/fragmentShader.js", ["../checks/mustBeBoolean", "../checks/mustBeDefined"], function(exports_1) {
  var mustBeBoolean_1,
      mustBeDefined_1;
  function fragmentShader(attributes, uniforms, vColor, vLight) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    mustBeBoolean_1.default('vColor', vColor);
    mustBeBoolean_1.default('vLight', vLight);
    var lines = [];
    lines.push("// fragment shader generated by EIGHT");
    if (false) {
      lines.push("#ifdef GL_ES");
      lines.push("#  ifdef GL_FRAGMENT_PRECISION_HIGH");
      lines.push("precision highp float;");
      lines.push("#  else");
      lines.push("precision mediump float;");
      lines.push("#  endif");
      lines.push("#endif");
    }
    if (vColor) {
      lines.push("varying highp vec4 vColor;");
    }
    if (vLight) {
      lines.push("varying highp vec3 vLight;");
    }
    lines.push("void main(void) {");
    if (vLight) {
      if (vColor) {
        lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
      } else {
        lines.push("  gl_FragColor = vec4(vLight, 1.0);");
      }
    } else {
      if (vColor) {
        lines.push("  gl_FragColor = vColor;");
      } else {
        lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
      }
    }
    lines.push("}");
    var code = lines.join("\n");
    return code;
  }
  exports_1("default", fragmentShader);
  return {
    setters: [function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/getAttribVarName.js", ["../checks/isDefined", "../checks/mustBeObject", "../checks/mustBeString"], function(exports_1) {
  var isDefined_1,
      mustBeObject_1,
      mustBeString_1;
  function getAttribVarName(attribute, varName) {
    mustBeObject_1.default('attribute', attribute);
    mustBeString_1.default('varName', varName);
    return isDefined_1.default(attribute.name) ? mustBeString_1.default('attribute.name', attribute.name) : varName;
  }
  exports_1("default", getAttribVarName);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/getUniformVarName.js", ["../checks/isDefined", "../checks/expectArg"], function(exports_1) {
  var isDefined_1,
      expectArg_1;
  function getUniformVarName(uniform, varName) {
    expectArg_1.default('uniform', uniform).toBeObject();
    expectArg_1.default('varName', varName).toBeString();
    return isDefined_1.default(uniform.name) ? expectArg_1.default('uniform.name', uniform.name).toBeString().value : varName;
  }
  exports_1("default", getUniformVarName);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/programs/vertexShader.js", ["../core/getAttribVarName", "../core/getUniformVarName", "../checks/mustBeBoolean", "../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var getAttribVarName_1,
      getUniformVarName_1,
      mustBeBoolean_1,
      mustBeDefined_1,
      GraphicsProgramSymbols_1;
  var SPACE,
      ATTRIBUTE,
      UNIFORM,
      COMMA,
      SEMICOLON,
      LPAREN,
      RPAREN,
      TIMES,
      ASSIGN,
      DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME;
  function getUniformCodeName(uniforms, name) {
    return getUniformVarName_1.default(uniforms[name], name);
  }
  function vertexShader(attributes, uniforms, vColor, vLight) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    mustBeBoolean_1.default('vColor', vColor);
    mustBeBoolean_1.default('vLight', vLight);
    var lines = [];
    lines.push("// vertex shader generated by EIGHT");
    for (var aName in attributes) {
      if (attributes.hasOwnProperty(aName)) {
        lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName_1.default(attributes[aName], aName) + SEMICOLON);
      }
    }
    for (var uName in uniforms) {
      if (uniforms.hasOwnProperty(uName)) {
        lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
      }
    }
    if (vColor) {
      lines.push("varying highp vec4 vColor;");
    }
    if (vLight) {
      lines.push("varying highp vec3 vLight;");
    }
    lines.push("void main(void) {");
    var glPosition = [];
    glPosition.unshift(SEMICOLON);
    if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION]) {
      switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION].glslType) {
        case 'float':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec2':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec3':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec4':
          {
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
          }
          break;
      }
    } else {
      glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX));
    }
    glPosition.unshift(ASSIGN);
    glPosition.unshift("gl_Position");
    glPosition.unshift('  ');
    lines.push(glPosition.join(''));
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE]) {
      lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE) + ";");
    }
    if (vColor) {
      if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR]) {
        var colorAttribVarName = getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR], GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR);
        switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType) {
          case 'vec4':
            {
              lines.push("  vColor = " + colorAttribVarName + SEMICOLON);
            }
            break;
          case 'vec3':
            {
              lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);");
            }
            break;
          default:
            {
              throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType);
            }
        }
      } else if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR]) {
        var colorUniformVarName = getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_COLOR);
        switch (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType) {
          case 'vec4':
            {
              lines.push("  vColor = " + colorUniformVarName + SEMICOLON);
            }
            break;
          case 'vec3':
            {
              lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);");
            }
            break;
          default:
            {
              throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType);
            }
        }
      } else {
        lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);");
      }
    }
    if (vLight) {
      if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX] && attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL]) {
        lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
        lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL], GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL) + ");");
        lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
        lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
          lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
        } else {
          lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
        }
      } else {
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
          lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + ";");
        } else {
          lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
        }
      }
    }
    lines.push("}");
    var code = lines.join("\n");
    return code;
  }
  exports_1("default", vertexShader);
  return {
    setters: [function(getAttribVarName_1_1) {
      getAttribVarName_1 = getAttribVarName_1_1;
    }, function(getUniformVarName_1_1) {
      getUniformVarName_1 = getUniformVarName_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      SPACE = ' ';
      ATTRIBUTE = 'attribute' + SPACE;
      UNIFORM = 'uniform' + SPACE;
      COMMA = ',' + SPACE;
      SEMICOLON = ';';
      LPAREN = '(';
      RPAREN = ')';
      TIMES = SPACE + '*' + SPACE;
      ASSIGN = SPACE + '=' + SPACE;
      DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";
    }
  };
});

System.register("davinci-eight/materials/GraphicsProgramBuilder.js", ["../core/getAttribVarName", "../programs/glslAttribType", "../checks/mustBeInteger", "../checks/mustBeString", "../materials/SmartGraphicsProgram", "../programs/vColorRequired", "../programs/vLightRequired", "../programs/fragmentShader", "../programs/vertexShader"], function(exports_1) {
  var getAttribVarName_1,
      glslAttribType_1,
      mustBeInteger_1,
      mustBeString_1,
      SmartGraphicsProgram_1,
      vColorRequired_1,
      vLightRequired_1,
      fragmentShader_1,
      vertexShader_1;
  var GraphicsProgramBuilder;
  function computeAttribParams(values) {
    var result = {};
    var keys = Object.keys(values);
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
      var key = keys[i];
      var attribute = values[key];
      var size = mustBeInteger_1.default('size', attribute.size);
      var varName = getAttribVarName_1.default(attribute, key);
      result[varName] = {glslType: glslAttribType_1.default(key, size)};
    }
    return result;
  }
  return {
    setters: [function(getAttribVarName_1_1) {
      getAttribVarName_1 = getAttribVarName_1_1;
    }, function(glslAttribType_1_1) {
      glslAttribType_1 = glslAttribType_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(SmartGraphicsProgram_1_1) {
      SmartGraphicsProgram_1 = SmartGraphicsProgram_1_1;
    }, function(vColorRequired_1_1) {
      vColorRequired_1 = vColorRequired_1_1;
    }, function(vLightRequired_1_1) {
      vLightRequired_1 = vLightRequired_1_1;
    }, function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }],
    execute: function() {
      GraphicsProgramBuilder = (function() {
        function GraphicsProgramBuilder(primitive) {
          this.aMeta = {};
          this.uParams = {};
          if (primitive) {
            var attributes = primitive.attributes;
            var keys = Object.keys(attributes);
            for (var i = 0,
                iLength = keys.length; i < iLength; i++) {
              var key = keys[i];
              var attribute = attributes[key];
              this.attribute(key, attribute.size);
            }
          }
        }
        GraphicsProgramBuilder.prototype.attribute = function(name, size) {
          mustBeString_1.default('name', name);
          mustBeInteger_1.default('size', size);
          this.aMeta[name] = {size: size};
          return this;
        };
        GraphicsProgramBuilder.prototype.uniform = function(name, type) {
          mustBeString_1.default('name', name);
          mustBeString_1.default('type', type);
          this.uParams[name] = {glslType: type};
          return this;
        };
        GraphicsProgramBuilder.prototype.build = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return new SmartGraphicsProgram_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.vertexShader = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return vertexShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.fragmentShader = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return fragmentShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        return GraphicsProgramBuilder;
      })();
      exports_1("default", GraphicsProgramBuilder);
    }
  };
});

System.register("davinci-eight/core/AttribLocation.js", ["../checks/mustBeString", "../i18n/readOnly"], function(exports_1) {
  var mustBeString_1,
      readOnly_1;
  var AttribLocation;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      AttribLocation = (function() {
        function AttribLocation(name) {
          this._name = mustBeString_1.default('name', name);
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
          get: function() {
            return this._index;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('index').message);
          },
          enumerable: true,
          configurable: true
        });
        AttribLocation.prototype.contextFree = function() {
          this._index = void 0;
          this._context = void 0;
        };
        AttribLocation.prototype.contextGain = function(context, program) {
          this._index = context.getAttribLocation(program, this._name);
          this._context = context;
        };
        AttribLocation.prototype.contextLost = function() {
          this._index = void 0;
          this._context = void 0;
        };
        AttribLocation.prototype.vertexPointer = function(size, normalized, stride, offset) {
          if (normalized === void 0) {
            normalized = false;
          }
          if (stride === void 0) {
            stride = 0;
          }
          if (offset === void 0) {
            offset = 0;
          }
          this._context.vertexAttribPointer(this._index, size, this._context.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function() {
          this._context.enableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.disable = function() {
          this._context.disableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.toString = function() {
          return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
      })();
      exports_1("default", AttribLocation);
    }
  };
});

System.register("davinci-eight/core/makeWebGLShader.js", [], function(exports_1) {
  function makeWebGLShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
      return shader;
    } else {
      if (!gl.isContextLost()) {
        var message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Error compiling shader: " + message);
      } else {
        throw new Error("Context lost while compiling shader");
      }
    }
  }
  exports_1("default", makeWebGLShader);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/makeWebGLProgram.js", ["./makeWebGLShader"], function(exports_1) {
  var makeWebGLShader_1;
  function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
    var vs = makeWebGLShader_1.default(ctx, vertexShader, ctx.VERTEX_SHADER);
    var fs = makeWebGLShader_1.default(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
    var program = ctx.createProgram();
    ctx.attachShader(program, vs);
    ctx.attachShader(program, fs);
    for (var index = 0; index < attribs.length; ++index) {
      ctx.bindAttribLocation(program, index, attribs[index]);
    }
    ctx.linkProgram(program);
    var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
    if (linked || ctx.isContextLost()) {
      return program;
    } else {
      var message = ctx.getProgramInfoLog(program);
      ctx.detachShader(program, vs);
      ctx.deleteShader(vs);
      ctx.detachShader(program, fs);
      ctx.deleteShader(fs);
      ctx.deleteProgram(program);
      throw new Error("Error linking program: " + message);
    }
  }
  exports_1("default", makeWebGLProgram);
  return {
    setters: [function(makeWebGLShader_1_1) {
      makeWebGLShader_1 = makeWebGLShader_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeUndefined.js", ["../checks/mustSatisfy", "../checks/isUndefined"], function(exports_1) {
  var mustSatisfy_1,
      isUndefined_1;
  function beUndefined() {
    return "be 'undefined'";
  }
  function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isUndefined_1.default(value), beUndefined, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/UniformLocation.js", ["../checks/mustBeString"], function(exports_1) {
  var mustBeString_1;
  var UniformLocation;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {
      UniformLocation = (function() {
        function UniformLocation(name) {
          this._name = mustBeString_1.default('name', name);
        }
        UniformLocation.prototype.contextFree = function() {
          this.contextLost();
        };
        UniformLocation.prototype.contextGain = function(context, program) {
          this.contextLost();
          this._context = context;
          this._location = context.getUniformLocation(program, this._name);
          this._program = program;
        };
        UniformLocation.prototype.contextLost = function() {
          this._context = void 0;
          this._location = void 0;
          this._program = void 0;
        };
        UniformLocation.prototype.vec1 = function(coords) {
          this._context.uniform1f(this._location, coords.x);
          return this;
        };
        UniformLocation.prototype.vec2 = function(coords) {
          this._context.uniform2f(this._location, coords.x, coords.y);
          return this;
        };
        UniformLocation.prototype.vec3 = function(coords) {
          this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
          return this;
        };
        UniformLocation.prototype.vec4 = function(coords) {
          this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
          return this;
        };
        UniformLocation.prototype.uniform1f = function(x) {
          this._context.uniform1f(this._location, x);
        };
        UniformLocation.prototype.uniform2f = function(x, y) {
          this._context.uniform2f(this._location, x, y);
        };
        UniformLocation.prototype.uniform3f = function(x, y, z) {
          this._context.uniform3f(this._location, x, y, z);
        };
        UniformLocation.prototype.uniform4f = function(x, y, z, w) {
          this._context.uniform4f(this._location, x, y, z, w);
        };
        UniformLocation.prototype.mat2 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix2fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.mat3 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix3fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.mat4 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix4fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.vector2 = function(data) {
          this._context.uniform2fv(this._location, data);
        };
        UniformLocation.prototype.vector3 = function(data) {
          this._context.uniform3fv(this._location, data);
        };
        UniformLocation.prototype.vector4 = function(data) {
          this._context.uniform4fv(this._location, data);
        };
        UniformLocation.prototype.toString = function() {
          return ['uniform', this._name].join(' ');
        };
        return UniformLocation;
      })();
      exports_1("default", UniformLocation);
    }
  };
});

System.register("davinci-eight/core/ShareableWebGLProgram.js", ["./AttribLocation", "./makeWebGLProgram", "../checks/mustBeArray", "../checks/mustBeObject", "../checks/mustBeString", "../checks/mustBeUndefined", "../i18n/readOnly", "./ShareableContextListener", "./UniformLocation"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AttribLocation_1,
      makeWebGLProgram_1,
      mustBeArray_1,
      mustBeObject_1,
      mustBeString_1,
      mustBeUndefined_1,
      readOnly_1,
      ShareableContextListener_1,
      UniformLocation_1;
  var ShareableWebGLProgram;
  return {
    setters: [function(AttribLocation_1_1) {
      AttribLocation_1 = AttribLocation_1_1;
    }, function(makeWebGLProgram_1_1) {
      makeWebGLProgram_1 = makeWebGLProgram_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustBeUndefined_1_1) {
      mustBeUndefined_1 = mustBeUndefined_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }, function(UniformLocation_1_1) {
      UniformLocation_1 = UniformLocation_1_1;
    }],
    execute: function() {
      ShareableWebGLProgram = (function(_super) {
        __extends(ShareableWebGLProgram, _super);
        function ShareableWebGLProgram(vertexShader, fragmentShader, attribs) {
          if (attribs === void 0) {
            attribs = [];
          }
          _super.call(this, 'ShareableWebGLProgram');
          this.attributes = {};
          this.uniforms = {};
          this._vertexShader = mustBeString_1.default('vertexShader', vertexShader);
          this._fragmentShader = mustBeString_1.default('fragmentShader', fragmentShader);
          this.attribs = mustBeArray_1.default('attribs', attribs);
        }
        ShareableWebGLProgram.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
          mustBeUndefined_1.default(this._type, this._program);
        };
        ShareableWebGLProgram.prototype.contextGain = function(context) {
          mustBeObject_1.default('context', context);
          var gl = context.gl;
          if (!this._program) {
            this._program = makeWebGLProgram_1.default(gl, this._vertexShader, this._fragmentShader, this.attribs);
            var program = this._program;
            var attributes = this.attributes;
            var uniforms = this.uniforms;
            var activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var a = 0; a < activeAttributes; a++) {
              var activeAttribInfo = gl.getActiveAttrib(program, a);
              var name_1 = activeAttribInfo.name;
              if (!attributes[name_1]) {
                attributes[name_1] = new AttribLocation_1.default(name_1);
              }
            }
            var activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var u = 0; u < activeUniforms; u++) {
              var activeUniformInfo = gl.getActiveUniform(program, u);
              var name_2 = activeUniformInfo.name;
              if (!uniforms[name_2]) {
                uniforms[name_2] = new UniformLocation_1.default(name_2);
              }
            }
            for (var aName in attributes) {
              if (attributes.hasOwnProperty(aName)) {
                attributes[aName].contextGain(gl, program);
              }
            }
            for (var uName in uniforms) {
              if (uniforms.hasOwnProperty(uName)) {
                uniforms[uName].contextGain(gl, program);
              }
            }
          }
          _super.prototype.contextGain.call(this, context);
        };
        ShareableWebGLProgram.prototype.contextLost = function() {
          this._program = void 0;
          for (var aName in this.attributes) {
            if (this.attributes.hasOwnProperty(aName)) {
              this.attributes[aName].contextLost();
            }
          }
          for (var uName in this.uniforms) {
            if (this.uniforms.hasOwnProperty(uName)) {
              this.uniforms[uName].contextLost();
            }
          }
          _super.prototype.contextLost.call(this);
        };
        ShareableWebGLProgram.prototype.contextFree = function(context) {
          mustBeObject_1.default('context', context);
          if (this._program) {
            var gl = context.gl;
            if (gl) {
              if (!gl.isContextLost()) {
                gl.deleteProgram(this._program);
              } else {}
            } else {
              console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
            }
            this._program = void 0;
          }
          for (var aName in this.attributes) {
            if (this.attributes.hasOwnProperty(aName)) {
              this.attributes[aName].contextFree();
            }
          }
          for (var uName in this.uniforms) {
            if (this.uniforms.hasOwnProperty(uName)) {
              this.uniforms[uName].contextFree();
            }
          }
          _super.prototype.contextFree.call(this, context);
        };
        ShareableWebGLProgram.prototype.use = function() {
          var gl = this.gl;
          if (gl) {
            gl.useProgram(this._program);
          } else {
            console.warn(this._type + ".use() missing WebGL rendering context.");
          }
        };
        Object.defineProperty(ShareableWebGLProgram.prototype, "vertexShader", {
          get: function() {
            return this._vertexShader;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vertexShader').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ShareableWebGLProgram.prototype, "fragmentShader", {
          get: function() {
            return this._fragmentShader;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('fragmentShader').message);
          },
          enumerable: true,
          configurable: true
        });
        ShareableWebGLProgram.prototype.enableAttrib = function(name) {
          var attribLoc = this.attributes[name];
          if (attribLoc) {
            attribLoc.enable();
          }
        };
        ShareableWebGLProgram.prototype.disableAttrib = function(name) {
          var attribLoc = this.attributes[name];
          if (attribLoc) {
            attribLoc.disable();
          }
        };
        ShareableWebGLProgram.prototype.uniform1f = function(name, x) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform1f(x);
          }
        };
        ShareableWebGLProgram.prototype.uniform2f = function(name, x, y) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform2f(x, y);
          }
        };
        ShareableWebGLProgram.prototype.uniform3f = function(name, x, y, z) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform3f(x, y, z);
          }
        };
        ShareableWebGLProgram.prototype.uniform4f = function(name, x, y, z, w) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w);
          }
        };
        ShareableWebGLProgram.prototype.mat2 = function(name, matrix, transpose) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat2(matrix, transpose);
          }
        };
        ShareableWebGLProgram.prototype.mat3 = function(name, matrix, transpose) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat3(matrix, transpose);
          }
        };
        ShareableWebGLProgram.prototype.mat4 = function(name, matrix, transpose) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat4(matrix, transpose);
          }
        };
        ShareableWebGLProgram.prototype.vec2 = function(name, vector) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec2(vector);
          }
        };
        ShareableWebGLProgram.prototype.vec3 = function(name, vector) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec3(vector);
          }
        };
        ShareableWebGLProgram.prototype.vec4 = function(name, vector) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec4(vector);
          }
        };
        ShareableWebGLProgram.prototype.vector2 = function(name, data) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector2(data);
          }
        };
        ShareableWebGLProgram.prototype.vector3 = function(name, data) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector3(data);
          }
        };
        ShareableWebGLProgram.prototype.vector4 = function(name, data) {
          var uniformLoc = this.uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector4(data);
          }
        };
        return ShareableWebGLProgram;
      })(ShareableContextListener_1.default);
      exports_1("default", ShareableWebGLProgram);
    }
  };
});

System.register("davinci-eight/materials/MeshLambertMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/ShareableWebGLProgram"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      ShareableWebGLProgram_1;
  var MeshLambertMaterial;
  function vertexShader() {
    var smb = new GraphicsProgramBuilder_1.default();
    smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return smb.vertexShader();
  }
  function fragmentShader() {
    var smb = new GraphicsProgramBuilder_1.default();
    smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return smb.fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(ShareableWebGLProgram_1_1) {
      ShareableWebGLProgram_1 = ShareableWebGLProgram_1_1;
    }],
    execute: function() {
      MeshLambertMaterial = (function(_super) {
        __extends(MeshLambertMaterial, _super);
        function MeshLambertMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshLambertMaterial;
      })(ShareableWebGLProgram_1.default);
      exports_1("default", MeshLambertMaterial);
    }
  };
});

System.register("davinci-eight/geometries/arc3.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/SpinG3", "../math/R3"], function(exports_1) {
  var mustBeDefined_1,
      mustBeInteger_1,
      mustBeNumber_1,
      SpinG3_1,
      R3_1;
  function arc3(begin, angle, generator, segments) {
    mustBeDefined_1.default('begin', begin);
    mustBeNumber_1.default('angle', angle);
    mustBeDefined_1.default('generator', generator);
    mustBeInteger_1.default('segments', segments);
    var points = [];
    var point = R3_1.default.copy(begin);
    var rotor = SpinG3_1.default.copy(generator).scale((-angle / 2) / segments).exp();
    points.push(point.clone());
    for (var i = 0; i < segments; i++) {
      point.rotate(rotor);
      points.push(point.clone());
    }
    return points;
  }
  exports_1("default", arc3);
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/CartesianE3.js", ["../checks/mustBeNumber", "../i18n/readOnly"], function(exports_1) {
  var mustBeNumber_1,
      readOnly_1;
  var zero,
      e1,
      e2,
      e3,
      CartesianE3;
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      CartesianE3 = (function() {
        function CartesianE3(x, y, z, areYouSure) {
          mustBeNumber_1.default('x', x);
          mustBeNumber_1.default('y', y);
          mustBeNumber_1.default('z', z);
          this.coordinates = [x, y, z];
          if (!areYouSure) {
            console.warn("Try constructing CartesianE3 from geometric static methods.");
          }
        }
        Object.defineProperty(CartesianE3.prototype, "x", {
          get: function() {
            return this.coordinates[0];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('x').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "y", {
          get: function() {
            return this.coordinates[1];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('y').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CartesianE3.prototype, "z", {
          get: function() {
            return this.coordinates[2];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('z').message);
          },
          enumerable: true,
          configurable: true
        });
        CartesianE3.prototype.magnitude = function() {
          return Math.sqrt(this.squaredNorm());
        };
        CartesianE3.prototype.squaredNorm = function() {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          return x * x + y * y + z * z;
        };
        Object.defineProperty(CartesianE3, "zero", {
          get: function() {
            return zero;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CartesianE3, "e1", {
          get: function() {
            return e1;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CartesianE3, "e2", {
          get: function() {
            return e2;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CartesianE3, "e3", {
          get: function() {
            return e3;
          },
          enumerable: true,
          configurable: true
        });
        CartesianE3.fromVectorE3 = function(vector) {
          return new CartesianE3(vector.x, vector.y, vector.z, true);
        };
        CartesianE3.direction = function(vector) {
          var x = vector.x;
          var y = vector.y;
          var z = vector.z;
          var m = Math.sqrt(x * x + y * y + z * z);
          return new CartesianE3(x / m, y / m, z / m, true);
        };
        return CartesianE3;
      })();
      exports_1("default", CartesianE3);
      zero = new CartesianE3(0, 0, 0, true);
      e1 = new CartesianE3(1, 0, 0, true);
      e2 = new CartesianE3(0, 1, 0, true);
      e3 = new CartesianE3(0, 0, 1, true);
    }
  };
});

System.register("davinci-eight/checks/isBoolean.js", [], function(exports_1) {
  function isBoolean(x) {
    return (typeof x === 'boolean');
  }
  exports_1("default", isBoolean);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeBoolean.js", ["../checks/mustSatisfy", "../checks/isBoolean"], function(exports_1) {
  var mustSatisfy_1,
      isBoolean_1;
  function beBoolean() {
    return "be `boolean`";
  }
  function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isBoolean_1.default(value), beBoolean, contextBuilder);
    return value;
  }
  exports_1("default", mustBeBoolean);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isBoolean_1_1) {
      isBoolean_1 = isBoolean_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/Geometry.js", ["../math/CartesianE3", "../checks/mustBeBoolean", "../checks/mustBeObject"], function(exports_1) {
  var CartesianE3_1,
      mustBeBoolean_1,
      mustBeObject_1;
  var Geometry;
  return {
    setters: [function(CartesianE3_1_1) {
      CartesianE3_1 = CartesianE3_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {
      Geometry = (function() {
        function Geometry() {
          this._position = CartesianE3_1.default.zero;
          this.useTextureCoords = false;
        }
        Object.defineProperty(Geometry.prototype, "position", {
          get: function() {
            return this._position;
          },
          set: function(position) {
            this.setPosition(position);
          },
          enumerable: true,
          configurable: true
        });
        Geometry.prototype.enableTextureCoords = function(enable) {
          mustBeBoolean_1.default('enable', enable);
          this.useTextureCoords = enable;
          return this;
        };
        Geometry.prototype.setPosition = function(position) {
          mustBeObject_1.default('position', position);
          this._position = CartesianE3_1.default.fromVectorE3(position);
          return this;
        };
        Geometry.prototype.toPrimitives = function() {
          console.warn("Geometry.toPrimitives() must be implemented by derived classes.");
          return [];
        };
        return Geometry;
      })();
      exports_1("default", Geometry);
    }
  };
});

System.register("davinci-eight/collections/copyToArray.js", [], function(exports_1) {
  function copyToArray(source, destination, offset) {
    if (destination === void 0) {
      destination = [];
    }
    if (offset === void 0) {
      offset = 0;
    }
    var length = source.length;
    for (var i = 0; i < length; i++) {
      destination[offset + i] = source[i];
    }
    return destination;
  }
  exports_1("default", copyToArray);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/dataFromVectorN.js", ["../math/G2", "../math/G3", "../math/R2", "../math/R3"], function(exports_1) {
  var G2_1,
      G3_1,
      R2_1,
      R3_1;
  function dataFromVectorN(source) {
    if (source instanceof G3_1.default) {
      var g3 = source;
      return [g3.x, g3.y, g3.z];
    } else if (source instanceof G2_1.default) {
      var g2 = source;
      return [g2.x, g2.y];
    } else if (source instanceof R3_1.default) {
      var v3 = source;
      return [v3.x, v3.y, v3.z];
    } else if (source instanceof R2_1.default) {
      var v2 = source;
      return [v2.x, v2.y];
    } else {
      return source.coords;
    }
  }
  exports_1("default", dataFromVectorN);
  return {
    setters: [function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/DrawAttribute.js", [], function(exports_1) {
  var DrawAttribute;
  function isVectorN(values) {
    return true;
  }
  function checkValues(values) {
    if (!isVectorN(values)) {
      throw new Error("values must be a number[]");
    }
    return values;
  }
  function isExactMultipleOf(numer, denom) {
    return numer % denom === 0;
  }
  function checkSize(size, values) {
    if (typeof size === 'number') {
      if (!isExactMultipleOf(values.length, size)) {
        throw new Error("values.length must be an exact multiple of size");
      }
    } else {
      throw new Error("size must be a number");
    }
    return size;
  }
  return {
    setters: [],
    execute: function() {
      DrawAttribute = (function() {
        function DrawAttribute(values, size) {
          this.values = checkValues(values);
          this.size = checkSize(size, values);
        }
        return DrawAttribute;
      })();
      exports_1("default", DrawAttribute);
    }
  };
});

System.register("davinci-eight/core/DrawMode.js", [], function(exports_1) {
  var DrawMode;
  return {
    setters: [],
    execute: function() {
      (function(DrawMode) {
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        DrawMode[DrawMode["LINE_LOOP"] = 3] = "LINE_LOOP";
        DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        DrawMode[DrawMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
      })(DrawMode || (DrawMode = {}));
      exports_1("default", DrawMode);
    }
  };
});

System.register("davinci-eight/geometries/DrawPrimitive.js", ["../checks/mustBeArray", "../checks/mustBeInteger", "../checks/mustBeObject"], function(exports_1) {
  var mustBeArray_1,
      mustBeInteger_1,
      mustBeObject_1;
  var DrawPrimitive;
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {
      DrawPrimitive = (function() {
        function DrawPrimitive(mode, indices, attributes) {
          this.attributes = {};
          this.mode = mustBeInteger_1.default('mode', mode);
          this.indices = mustBeArray_1.default('indices', indices);
          this.attributes = mustBeObject_1.default('attributes', attributes);
        }
        return DrawPrimitive;
      })();
      exports_1("default", DrawPrimitive);
    }
  };
});

System.register("davinci-eight/geometries/computeUniqueVertices.js", [], function(exports_1) {
  function computeUniqueVertices(geometry) {
    var map = {};
    var vertices = [];
    function munge(vertex) {
      var key = vertex.toString();
      if (map[key]) {
        var existing = map[key];
        vertex.index = existing.index;
      } else {
        vertex.index = vertices.length;
        vertices.push(vertex);
        map[key] = vertex;
      }
    }
    geometry.forEach(function(simplex) {
      simplex.vertices.forEach(function(vertex) {
        munge(vertex);
      });
    });
    return vertices;
  }
  exports_1("default", computeUniqueVertices);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/simplicesToDrawPrimitive.js", ["../collections/copyToArray", "../geometries/dataFromVectorN", "../geometries/DrawAttribute", "../core/DrawMode", "../geometries/DrawPrimitive", "../geometries/simplicesToGeometryMeta", "../geometries/computeUniqueVertices", "../checks/expectArg", "../geometries/Simplex", "../math/VectorN"], function(exports_1) {
  var copyToArray_1,
      dataFromVectorN_1,
      DrawAttribute_1,
      DrawMode_1,
      DrawPrimitive_1,
      simplicesToGeometryMeta_1,
      computeUniqueVertices_1,
      expectArg_1,
      Simplex_1,
      VectorN_1;
  function numberList(size, value) {
    var data = [];
    for (var i = 0; i < size; i++) {
      data.push(value);
    }
    return data;
  }
  function attribName(name, attribMap) {
    expectArg_1.default('name', name).toBeString();
    expectArg_1.default('attribMap', attribMap).toBeObject();
    var meta = attribMap[name];
    if (meta) {
      var alias = meta.name;
      return alias ? alias : name;
    } else {
      throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
  }
  function attribSize(key, attribMap) {
    expectArg_1.default('key', key).toBeString();
    expectArg_1.default('attribMap', attribMap).toBeObject();
    var meta = attribMap[key];
    if (meta) {
      var size = meta.size;
      expectArg_1.default('size', size).toBeNumber();
      return meta.size;
    } else {
      throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
  }
  function concat(a, b) {
    return a.concat(b);
  }
  function simplicesToDrawPrimitive(simplices, geometryMeta) {
    expectArg_1.default('simplices', simplices).toBeObject();
    var actuals = simplicesToGeometryMeta_1.default(simplices);
    if (geometryMeta) {
      expectArg_1.default('geometryMeta', geometryMeta).toBeObject();
    } else {
      geometryMeta = actuals;
    }
    var attribMap = geometryMeta.attributes;
    var keys = Object.keys(attribMap);
    var keysLen = keys.length;
    var k;
    var vertices = computeUniqueVertices_1.default(simplices);
    var vsLength = vertices.length;
    var i;
    var indices = simplices.map(Simplex_1.default.indices).reduce(concat, []);
    var outputs = [];
    for (k = 0; k < keysLen; k++) {
      var key = keys[k];
      var dims = attribSize(key, attribMap);
      var data = numberList(vsLength * dims, void 0);
      outputs.push({
        data: data,
        dimensions: dims,
        name: attribName(key, attribMap)
      });
    }
    for (i = 0; i < vsLength; i++) {
      var vertex = vertices[i];
      var vertexAttribs = vertex.attributes;
      if (vertex.index !== i) {
        expectArg_1.default('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
      }
      for (k = 0; k < keysLen; k++) {
        var output = outputs[k];
        var size = output.dimensions;
        var value = vertexAttribs[keys[k]];
        if (!value) {
          value = new VectorN_1.default(numberList(size, 0), false, size);
        }
        var data = dataFromVectorN_1.default(value);
        copyToArray_1.default(data, output.data, i * output.dimensions);
      }
    }
    var attributes = {};
    for (k = 0; k < keysLen; k++) {
      var output = outputs[k];
      var data = output.data;
      attributes[output.name] = new DrawAttribute_1.default(data, output.dimensions);
    }
    switch (geometryMeta.k) {
      case Simplex_1.default.TRIANGLE:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.TRIANGLES, indices, attributes);
        }
      case Simplex_1.default.LINE:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.LINES, indices, attributes);
        }
      case Simplex_1.default.POINT:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
        }
      case Simplex_1.default.EMPTY:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
        }
      default:
        {
          throw new Error("k => " + geometryMeta.k);
        }
    }
  }
  exports_1("default", simplicesToDrawPrimitive);
  return {
    setters: [function(copyToArray_1_1) {
      copyToArray_1 = copyToArray_1_1;
    }, function(dataFromVectorN_1_1) {
      dataFromVectorN_1 = dataFromVectorN_1_1;
    }, function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(simplicesToGeometryMeta_1_1) {
      simplicesToGeometryMeta_1 = simplicesToGeometryMeta_1_1;
    }, function(computeUniqueVertices_1_1) {
      computeUniqueVertices_1 = computeUniqueVertices_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorE2.js", ["../checks/isDefined"], function(exports_1) {
  var isDefined_1;
  function dotVectorE2(a, b) {
    if (isDefined_1.default(a) && isDefined_1.default(b)) {
      return a.x * b.x + a.y * b.y;
    } else {
      return void 0;
    }
  }
  exports_1("default", dotVectorE2);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Euclidean2.js", ["../geometries/b2", "../geometries/b3", "../math/extE2", "../checks/isDefined", "../math/lcoE2", "../math/rcoE2", "../math/mulE2", "../checks/mustBeInteger", "../checks/mustBeNumber", "../i18n/readOnly", "../math/scpE2", "../math/stringFromCoordinates", "../math/Unit"], function(exports_1) {
  var b2_1,
      b3_1,
      extE2_1,
      isDefined_1,
      lcoE2_1,
      rcoE2_1,
      mulE2_1,
      mustBeInteger_1,
      mustBeNumber_1,
      readOnly_1,
      scpE2_1,
      stringFromCoordinates_1,
      Unit_1;
  var exp,
      cos,
      sin,
      sqrt,
      divide,
      Euclidean2;
  function assertArgEuclidean2(name, arg) {
    if (arg instanceof Euclidean2) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a Euclidean2");
    }
  }
  function assertArgUnitOrUndefined(name, uom) {
    if (typeof uom === 'undefined' || uom instanceof Unit_1.default) {
      return uom;
    } else {
      throw new Error("Argument '" + uom + "' must be a Unit or undefined");
    }
  }
  function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a00 + b00);
  }
  function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a01 + b01);
  }
  function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a10 + b10);
  }
  function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a11 + b11);
  }
  function addE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 + b0);
        }
        break;
      case 1:
        {
          x = +(a1 + b1);
        }
        break;
      case 2:
        {
          x = +(a2 + b2);
        }
        break;
      case 3:
        {
          x = +(a3 + b3);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 - b0);
        }
        break;
      case 1:
        {
          x = +(a1 - b1);
        }
        break;
      case 2:
        {
          x = +(a2 - b2);
        }
        break;
      case 3:
        {
          x = +(a3 - b3);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(extE2_1_1) {
      extE2_1 = extE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(lcoE2_1_1) {
      lcoE2_1 = lcoE2_1_1;
    }, function(rcoE2_1_1) {
      rcoE2_1 = rcoE2_1_1;
    }, function(mulE2_1_1) {
      mulE2_1 = mulE2_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(scpE2_1_1) {
      scpE2_1 = scpE2_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }],
    execute: function() {
      exp = Math.exp;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      divide = function(a00, a01, a10, a11, b00, b01, b10, b11, uom) {
        var c00;
        var c01;
        var c10;
        var c11;
        var i00;
        var i01;
        var i10;
        var i11;
        var k00;
        var m00;
        var m01;
        var m10;
        var m11;
        var r00;
        var r01;
        var r10;
        var r11;
        var s00;
        var s01;
        var s10;
        var s11;
        var x00;
        var x01;
        var x10;
        var x11;
        r00 = +b00;
        r01 = +b01;
        r10 = +b10;
        r11 = -b11;
        m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
        m01 = 0;
        m10 = 0;
        m11 = 0;
        c00 = +m00;
        c01 = -m01;
        c10 = -m10;
        c11 = -m11;
        s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
        s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
        s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
        s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
        k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
        i00 = s00 / k00;
        i01 = s01 / k00;
        i10 = s10 / k00;
        i11 = s11 / k00;
        x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
        x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
        x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
        x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
        return new Euclidean2(x00, x01, x10, x11, uom);
      };
      Euclidean2 = (function() {
        function Euclidean2(α, x, y, β, uom) {
          this.w = mustBeNumber_1.default('α', α);
          this.x = mustBeNumber_1.default('x', x);
          this.y = mustBeNumber_1.default('y', y);
          this.xy = mustBeNumber_1.default('β', β);
          this.uom = assertArgUnitOrUndefined('uom', uom);
          if (this.uom && this.uom.multiplier !== 1) {
            var multiplier = this.uom.multiplier;
            this.w *= multiplier;
            this.x *= multiplier;
            this.y *= multiplier;
            this.xy *= multiplier;
            this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
          }
        }
        Object.defineProperty(Euclidean2.prototype, "α", {
          get: function() {
            return this.w;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('α').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Euclidean2.prototype, "β", {
          get: function() {
            return this.xy;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('β').message);
          },
          enumerable: true,
          configurable: true
        });
        Euclidean2.prototype.fromCartesian = function(α, x, y, β, uom) {
          mustBeNumber_1.default('α', α);
          mustBeNumber_1.default('x', x);
          mustBeNumber_1.default('y', y);
          mustBeNumber_1.default('β', β);
          assertArgUnitOrUndefined('uom', uom);
          return new Euclidean2(α, x, y, β, uom);
        };
        Euclidean2.prototype.fromPolar = function(α, r, θ, β, uom) {
          mustBeNumber_1.default('α', α);
          mustBeNumber_1.default('r', r);
          mustBeNumber_1.default('θ', θ);
          mustBeNumber_1.default('β', β);
          assertArgUnitOrUndefined('uom', uom);
          return new Euclidean2(α, r * cos(θ), r * sin(θ), β, uom);
        };
        Object.defineProperty(Euclidean2.prototype, "coords", {
          get: function() {
            return [this.w, this.x, this.y, this.xy];
          },
          enumerable: true,
          configurable: true
        });
        Euclidean2.prototype.coordinate = function(index) {
          mustBeNumber_1.default('index', index);
          switch (index) {
            case 0:
              return this.w;
            case 1:
              return this.x;
            case 2:
              return this.y;
            case 3:
              return this.xy;
            default:
              throw new Error("index must be in the range [0..3]");
          }
        };
        Euclidean2.add = function(a, b) {
          var a00 = a[0];
          var a01 = a[1];
          var a10 = a[2];
          var a11 = a[3];
          var b00 = b[0];
          var b01 = b[1];
          var b10 = b[2];
          var b11 = b[3];
          var x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
          var x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
          var x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
          var x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
          return [x00, x01, x10, x11];
        };
        Euclidean2.prototype.add = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var xs = Euclidean2.add(this.coords, rhs.coords);
          return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.addPseudo = function(β) {
          return new Euclidean2(this.α, this.x, this.y, this.β + β, this.uom);
        };
        Euclidean2.prototype.addScalar = function(α) {
          return new Euclidean2(this.α + α, this.x, this.y, this.β, this.uom);
        };
        Euclidean2.prototype.adj = function() {
          throw new Error("TODO: adj");
        };
        Euclidean2.prototype.__add__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.add(other);
          } else if (typeof other === 'number') {
            return this.add(new Euclidean2(other, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__radd__ = function(other) {
          if (other instanceof Euclidean2) {
            return other.add(this);
          } else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).add(this);
          }
        };
        Euclidean2.prototype.angle = function() {
          return this.log().grade(2);
        };
        Euclidean2.prototype.clone = function() {
          return this;
        };
        Euclidean2.prototype.conj = function() {
          throw new Error("TODO: adj");
        };
        Euclidean2.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.direction = function() {
          throw new Error('direction');
        };
        Euclidean2.prototype.distanceTo = function(point) {
          throw new Error("TODO: Euclidean2.distanceTo");
        };
        Euclidean2.prototype.equals = function(point) {
          throw new Error("TODO: Euclidean2.equals");
        };
        Euclidean2.sub = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.sub = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var xs = Euclidean2.sub(this.coords, rhs.coords);
          return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__sub__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.sub(other);
          } else if (typeof other === 'number') {
            return this.sub(new Euclidean2(other, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rsub__ = function(other) {
          if (other instanceof Euclidean2) {
            return other.sub(this);
          } else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).sub(this);
          }
        };
        Euclidean2.prototype.mul = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var a0 = this.w;
          var a1 = this.x;
          var a2 = this.y;
          var a3 = this.xy;
          var b0 = rhs.w;
          var b1 = rhs.x;
          var b2 = rhs.y;
          var b3 = rhs.xy;
          var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return new Euclidean2(c0, c1, c2, c3, Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__mul__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.mul(other);
          } else if (typeof other === 'number') {
            return this.mul(new Euclidean2(other, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rmul__ = function(other) {
          if (other instanceof Euclidean2) {
            var lhs = other;
            return lhs.mul(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new Euclidean2(w, 0, 0, 0, undefined).mul(this);
          }
        };
        Euclidean2.prototype.scale = function(α) {
          return new Euclidean2(this.w * α, this.x * α, this.y * α, this.xy * α, this.uom);
        };
        Euclidean2.prototype.div = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit_1.default.div(this.uom, rhs.uom));
        };
        Euclidean2.prototype.divByScalar = function(α) {
          return new Euclidean2(this.w / α, this.x / α, this.y / α, this.xy / α, this.uom);
        };
        Euclidean2.prototype.__div__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.div(other);
          } else if (typeof other === 'number') {
            var w = other;
            return this.div(new Euclidean2(w, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rdiv__ = function(other) {
          if (other instanceof Euclidean2) {
            var lhs = other;
            return lhs.div(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new Euclidean2(w, 0, 0, 0, undefined).div(this);
          }
        };
        Euclidean2.scp = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
          var x1 = 0;
          var x2 = 0;
          var x3 = 0;
          return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.scp = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var a0 = this.w;
          var a1 = this.x;
          var a2 = this.y;
          var a3 = this.xy;
          var b0 = this.w;
          var b1 = this.x;
          var b2 = this.y;
          var b3 = this.xy;
          var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          return new Euclidean2(c0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.ext = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.ext = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var xs = Euclidean2.ext(this.coords, rhs.coords);
          return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__wedge__ = function(other) {
          if (other instanceof Euclidean2) {
            var rhs = other;
            return this.ext(rhs);
          } else if (typeof other === 'number') {
            var w = other;
            return this.ext(new Euclidean2(w, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rwedge__ = function(other) {
          if (other instanceof Euclidean2) {
            var lhs = other;
            return lhs.ext(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new Euclidean2(w, 0, 0, 0, undefined).ext(this);
          }
        };
        Euclidean2.lshift = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.lerp = function(target, α) {
          return this;
        };
        Euclidean2.prototype.lco = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var xs = Euclidean2.lshift(this.coords, rhs.coords);
          return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__lshift__ = function(other) {
          if (other instanceof Euclidean2) {
            var rhs = other;
            return this.lco(rhs);
          } else if (typeof other === 'number') {
            var w = other;
            return this.lco(new Euclidean2(w, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rlshift__ = function(other) {
          if (other instanceof Euclidean2) {
            var lhs = other;
            return lhs.lco(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new Euclidean2(w, 0, 0, 0, undefined).lco(this);
          }
        };
        Euclidean2.rshift = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.rco = function(rhs) {
          assertArgEuclidean2('rhs', rhs);
          var xs = Euclidean2.rshift(this.coords, rhs.coords);
          return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__rshift__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.rco(other);
          } else if (typeof other === 'number') {
            return this.rco(new Euclidean2(other, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rrshift__ = function(other) {
          if (other instanceof Euclidean2) {
            return other.rco(this);
          } else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).rco(this);
          }
        };
        Euclidean2.prototype.__vbar__ = function(other) {
          if (other instanceof Euclidean2) {
            return this.scp(other);
          } else if (typeof other === 'number') {
            return this.scp(new Euclidean2(other, 0, 0, 0, undefined));
          }
        };
        Euclidean2.prototype.__rvbar__ = function(other) {
          if (other instanceof Euclidean2) {
            return other.scp(this);
          } else if (typeof other === 'number') {
            return new Euclidean2(other, 0, 0, 0, undefined).scp(this);
          }
        };
        Euclidean2.prototype.pow = function(exponent) {
          throw new Error('pow');
        };
        Euclidean2.prototype.__bang__ = function() {
          return this.inv();
        };
        Euclidean2.prototype.__pos__ = function() {
          return this;
        };
        Euclidean2.prototype.neg = function() {
          return new Euclidean2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.__neg__ = function() {
          return this.neg();
        };
        Euclidean2.prototype.__tilde__ = function() {
          return new Euclidean2(this.α, this.x, this.y, -this.β, this.uom);
        };
        Euclidean2.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              return new Euclidean2(this.α, 0, 0, 0, this.uom);
            case 1:
              return new Euclidean2(0, this.x, this.y, 0, this.uom);
            case 2:
              return new Euclidean2(0, 0, 0, this.β, this.uom);
            default:
              return new Euclidean2(0, 0, 0, 0, this.uom);
          }
        };
        Euclidean2.prototype.cos = function() {
          throw new Error('cos');
        };
        Euclidean2.prototype.cosh = function() {
          throw new Error('cosh');
        };
        Euclidean2.prototype.exp = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var expα = exp(this.α);
          var cosβ = cos(this.β);
          var sinβ = sin(this.β);
          return new Euclidean2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        Euclidean2.prototype.inv = function() {
          throw new Error('inv');
        };
        Euclidean2.prototype.log = function() {
          throw new Error('log');
        };
        Euclidean2.prototype.magnitude = function() {
          return this.norm();
        };
        Euclidean2.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        Euclidean2.prototype.norm = function() {
          return new Euclidean2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        Euclidean2.prototype.quad = function() {
          return this.squaredNorm();
        };
        Euclidean2.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          return new Euclidean2(0, x, y, 0, this.uom);
        };
        Euclidean2.prototype.squaredNorm = function() {
          return new Euclidean2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean2.prototype.squaredNormSansUnits = function() {
          var α = this.α;
          var x = this.x;
          var y = this.y;
          var β = this.β;
          return α * α + x * x + y * y + β * β;
        };
        Euclidean2.prototype.reflect = function(n) {
          var m = Euclidean2.fromVectorE2(n);
          return m.mul(this).mul(m).scale(-1);
        };
        Euclidean2.prototype.rev = function() {
          throw new Error('rev');
        };
        Euclidean2.prototype.rotate = function(R) {
          throw new Error('rotate');
        };
        Euclidean2.prototype.sin = function() {
          throw new Error('sin');
        };
        Euclidean2.prototype.sinh = function() {
          throw new Error('sinh');
        };
        Euclidean2.prototype.slerp = function(target, α) {
          return this;
        };
        Euclidean2.prototype.tan = function() {
          return this.sin().div(this.cos());
        };
        Euclidean2.prototype.isOne = function() {
          return this.w === 1 && this.x === 0 && this.y === 0 && this.xy === 0;
        };
        Euclidean2.prototype.isNaN = function() {
          return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy);
        };
        Euclidean2.prototype.isZero = function() {
          return this.w === 0 && this.x === 0 && this.y === 0 && this.xy === 0;
        };
        Euclidean2.prototype.toStringCustom = function(coordToString, labels) {
          var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
          if (this.uom) {
            var unitString = this.uom.toString().trim();
            if (unitString) {
              return quantityString + ' ' + unitString;
            } else {
              return quantityString;
            }
          } else {
            return quantityString;
          }
        };
        Euclidean2.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toStringIJK = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        Euclidean2.prototype.toStringLATEX = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        Euclidean2.copy = function(m) {
          if (m instanceof Euclidean2) {
            return m;
          } else {
            return new Euclidean2(m.α, m.x, m.y, m.β, void 0);
          }
        };
        Euclidean2.fromVectorE2 = function(vector) {
          if (isDefined_1.default(vector)) {
            if (vector instanceof Euclidean2) {
              return new Euclidean2(0, vector.x, vector.y, 0, vector.uom);
            } else {
              return new Euclidean2(0, vector.x, vector.y, 0, void 0);
            }
          } else {
            return void 0;
          }
        };
        return Euclidean2;
      })();
      exports_1("default", Euclidean2);
    }
  };
});

System.register("davinci-eight/math/extE2.js", [], function(exports_1) {
  function extE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a2 * b0);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", extE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoE2.js", [], function(exports_1) {
  function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 - a2 * b3);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b3);
        }
        break;
      case 3:
        {
          x = +(a0 * b3);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", lcoE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mulE2.js", [], function(exports_1) {
  function mulE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", mulE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorCartesianE2.js", [], function(exports_1) {
  function dotVectorCartesianE2(ax, ay, bx, by) {
    return ax * bx + ay * by;
  }
  exports_1("default", dotVectorCartesianE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/quadVectorE2.js", ["../math/dotVectorCartesianE2", "../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var dotVectorCartesianE2_1,
      isDefined_1,
      isNumber_1;
  function quadVectorE2(vector) {
    if (isDefined_1.default(vector)) {
      var x = vector.x;
      var y = vector.y;
      if (isNumber_1.default(x) && isNumber_1.default(y)) {
        return dotVectorCartesianE2_1.default(x, y, x, y);
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadVectorE2);
  return {
    setters: [function(dotVectorCartesianE2_1_1) {
      dotVectorCartesianE2_1 = dotVectorCartesianE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rcoE2.js", [], function(exports_1) {
  function rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(-a1 * b0 - a3 * b2);
        }
        break;
      case 2:
        {
          x = +(-a2 * b0 + a3 * b1);
        }
        break;
      case 3:
        {
          x = +(a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", rcoE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/scpE2.js", [], function(exports_1) {
  function scpE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    switch (index) {
      case 0:
        return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
      case 1:
        return 0;
      case 2:
        return 0;
      case 3:
        return 0;
      default:
        throw new Error("index must be in the range [0..3]");
    }
  }
  exports_1("default", scpE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/G2.js", ["../geometries/b2", "../geometries/b3", "../math/dotVectorE2", "../math/Euclidean2", "../math/extE2", "../checks/isDefined", "../checks/isNumber", "../checks/isObject", "../math/lcoE2", "../math/mulE2", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadVectorE2", "../math/rcoE2", "../math/rotorFromDirections", "../math/scpE2", "../math/stringFromCoordinates", "../math/VectorN", "../math/wedgeXY"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var b2_1,
      b3_1,
      dotVectorE2_1,
      Euclidean2_1,
      extE2_1,
      isDefined_1,
      isNumber_1,
      isObject_1,
      lcoE2_1,
      mulE2_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadVectorE2_1,
      rcoE2_1,
      rotorFromDirections_1,
      scpE2_1,
      stringFromCoordinates_1,
      VectorN_1,
      wedgeXY_1;
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_XY,
      PI,
      abs,
      atan2,
      exp,
      log,
      cos,
      sin,
      sqrt,
      LEFTWARDS_ARROW,
      RIGHTWARDS_ARROW,
      UPWARDS_ARROW,
      DOWNWARDS_ARROW,
      BULLSEYE,
      CLOCKWISE_OPEN_CIRCLE_ARROW,
      ANTICLOCKWISE_OPEN_CIRCLE_ARROW,
      ARROW_LABELS,
      STANDARD_LABELS,
      G2;
  function coordinates(m) {
    return [m.α, m.x, m.y, m.β];
  }
  function duckCopy(value) {
    if (isObject_1.default(value)) {
      var m = value;
      if (isNumber_1.default(m.x) && isNumber_1.default(m.y)) {
        if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
          console.warn("Copying GeometricE2 to G2");
          return G2.copy(m);
        } else {
          console.warn("Copying VectorE2 to G2");
          return G2.fromVector(m);
        }
      } else {
        if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
          console.warn("Copying SpinorE2 to G2");
          return G2.fromSpinor(m);
        } else {
          return void 0;
        }
      }
    } else {
      return void 0;
    }
  }
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(dotVectorE2_1_1) {
      dotVectorE2_1 = dotVectorE2_1_1;
    }, function(Euclidean2_1_1) {
      Euclidean2_1 = Euclidean2_1_1;
    }, function(extE2_1_1) {
      extE2_1 = extE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }, function(isObject_1_1) {
      isObject_1 = isObject_1_1;
    }, function(lcoE2_1_1) {
      lcoE2_1 = lcoE2_1_1;
    }, function(mulE2_1_1) {
      mulE2_1 = mulE2_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadVectorE2_1_1) {
      quadVectorE2_1 = quadVectorE2_1_1;
    }, function(rcoE2_1_1) {
      rcoE2_1 = rcoE2_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(scpE2_1_1) {
      scpE2_1 = scpE2_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_XY = 3;
      PI = Math.PI;
      abs = Math.abs;
      atan2 = Math.atan2;
      exp = Math.exp;
      log = Math.log;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      LEFTWARDS_ARROW = "←";
      RIGHTWARDS_ARROW = "→";
      UPWARDS_ARROW = "↑";
      DOWNWARDS_ARROW = "↓";
      BULLSEYE = "◎";
      CLOCKWISE_OPEN_CIRCLE_ARROW = "↻";
      ANTICLOCKWISE_OPEN_CIRCLE_ARROW = "↺";
      ARROW_LABELS = ["1", [LEFTWARDS_ARROW, RIGHTWARDS_ARROW], [DOWNWARDS_ARROW, UPWARDS_ARROW], [CLOCKWISE_OPEN_CIRCLE_ARROW, ANTICLOCKWISE_OPEN_CIRCLE_ARROW]];
      STANDARD_LABELS = ["1", "e1", "e2", "I"];
      G2 = (function(_super) {
        __extends(G2, _super);
        function G2() {
          _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(G2.prototype, "α", {
          get: function() {
            return this.coords[COORD_W];
          },
          set: function(α) {
            this.modified = this.modified || this.coords[COORD_W] !== α;
            this.coords[COORD_W] = α;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(x) {
            this.modified = this.modified || this.coords[COORD_X] !== x;
            this.coords[COORD_X] = x;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(y) {
            this.modified = this.modified || this.coords[COORD_Y] !== y;
            this.coords[COORD_Y] = y;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(β) {
            this.modified = this.modified || this.coords[COORD_XY] !== β;
            this.coords[COORD_XY] = β;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            this.modified = this.modified || this.coords[COORD_XY] !== xy;
            this.coords[COORD_XY] = xy;
          },
          enumerable: true,
          configurable: true
        });
        G2.prototype.add = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('M', M);
          mustBeNumber_1.default('α', α);
          this.α += M.α * α;
          this.x += M.x * α;
          this.y += M.y * α;
          this.β += M.β * α;
          return this;
        };
        G2.prototype.add2 = function(a, b) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          this.α = a.α + b.α;
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.β = a.β + b.β;
          return this;
        };
        G2.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          this.β += β;
          return this;
        };
        G2.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        G2.prototype.addVector = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('v', v);
          mustBeNumber_1.default('α', α);
          this.x += v.x * α;
          this.y += v.y * α;
          return this;
        };
        G2.prototype.adj = function() {
          throw new Error('TODO: G2.adj');
        };
        G2.prototype.angle = function() {
          return this.log().grade(2);
        };
        G2.prototype.clone = function() {
          var m = new G2();
          m.copy(this);
          return m;
        };
        G2.prototype.conj = function() {
          this.β = -this.β;
          return this;
        };
        G2.prototype.cos = function() {
          throw new Error("TODO: G2.cos");
        };
        G2.prototype.cosh = function() {
          throw new Error("TODO: G2.cosh");
        };
        G2.prototype.distanceTo = function(point) {
          throw new Error("TODO: G2.distanceTo");
        };
        G2.prototype.equals = function(point) {
          throw new Error("TODO: G2.equals");
        };
        G2.prototype.copy = function(M) {
          mustBeObject_1.default('M', M);
          this.α = M.α;
          this.x = M.x;
          this.y = M.y;
          this.β = M.β;
          return this;
        };
        G2.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        G2.prototype.copySpinor = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.α = spinor.α;
          this.x = 0;
          this.y = 0;
          this.β = spinor.xy;
          return this;
        };
        G2.prototype.copyVector = function(vector) {
          mustBeObject_1.default('vector', vector);
          this.α = 0;
          this.x = vector.x;
          this.y = vector.y;
          this.β = 0;
          return this;
        };
        G2.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
          this.α = α;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2.prototype.direction = function() {
          var norm = sqrt(this.squaredNormSansUnits());
          this.α = this.α / norm;
          this.x = this.x / norm;
          this.y = this.y / norm;
          this.β = this.β / norm;
          return this;
        };
        G2.prototype.div = function(m) {
          return this.div2(this, m);
        };
        G2.prototype.div2 = function(a, b) {
          return this;
        };
        G2.prototype.divByScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α /= α;
          this.x /= α;
          this.y /= α;
          this.β /= α;
          return this;
        };
        G2.prototype.dual = function(m) {
          var w = -m.β;
          var x = +m.y;
          var y = -m.x;
          var β = +m.α;
          this.α = w;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2.prototype.exp = function() {
          var w = this.α;
          var z = this.β;
          var expW = exp(w);
          var φ = sqrt(z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.β = z * s;
          return this;
        };
        G2.prototype.ext = function(m) {
          return this.ext2(this, m);
        };
        G2.prototype.ext2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2.prototype.inv = function() {
          this.conj();
          return this;
        };
        G2.prototype.isOne = function() {
          return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.isZero = function() {
          return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.lco = function(m) {
          return this.lco2(this, m);
        };
        G2.prototype.lco2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2.prototype.lerp = function(target, α) {
          mustBeObject_1.default('target', target);
          mustBeNumber_1.default('α', α);
          this.α += (target.α - this.α) * α;
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.β += (target.β - this.β) * α;
          return this;
        };
        G2.prototype.lerp2 = function(a, b, α) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          mustBeNumber_1.default('α', α);
          this.copy(a).lerp(b, α);
          return this;
        };
        G2.prototype.log = function() {
          var α = this.α;
          var β = this.β;
          this.α = log(sqrt(α * α + β * β));
          this.x = 0;
          this.y = 0;
          this.β = atan2(β, α);
          return this;
        };
        G2.prototype.magnitude = function() {
          return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.mul = function(m) {
          return this.mul2(this, m);
        };
        G2.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2.prototype.neg = function() {
          this.α = -this.α;
          this.x = -this.x;
          this.y = -this.y;
          this.β = -this.β;
          return this;
        };
        G2.prototype.norm = function() {
          this.α = this.magnitudeSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.one = function() {
          this.α = 1;
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.pow = function() {
          throw new Error("TODO: G2.pow");
        };
        G2.prototype.quad = function() {
          this.α = this.squaredNormSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
          this.α = α;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2.prototype.rco = function(m) {
          return this.rco2(this, m);
        };
        G2.prototype.rco2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2.prototype.reflect = function(n) {
          mustBeObject_1.default('n', n);
          var N = Euclidean2_1.default.fromVectorE2(n);
          var M = Euclidean2_1.default.copy(this);
          var R = N.mul(M).mul(N).scale(-1);
          this.copy(R);
          return this;
        };
        G2.prototype.rev = function() {
          this.α = this.α;
          this.x = this.x;
          this.y = this.y;
          this.β = -this.β;
          return this;
        };
        G2.prototype.sin = function() {
          throw new Error("G2.sin");
        };
        G2.prototype.sinh = function() {
          throw new Error("G2.sinh");
        };
        G2.prototype.rotate = function(R) {
          mustBeObject_1.default('R', R);
          var x = this.x;
          var y = this.y;
          var a = R.xy;
          var α = R.α;
          var ix = α * x + a * y;
          var iy = α * y - a * x;
          this.x = ix * α + iy * a;
          this.y = iy * α - ix * a;
          return this;
        };
        G2.prototype.rotorFromDirections = function(a, b) {
          if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
            return this;
          } else {
            this.rotorFromGeneratorAngle(G2.I, PI);
          }
          return this;
        };
        G2.prototype.rotorFromGeneratorAngle = function(B, θ) {
          mustBeObject_1.default('B', B);
          mustBeNumber_1.default('θ', θ);
          var β = B.xy;
          var φ = θ / 2;
          this.α = cos(abs(β) * φ);
          this.x = 0;
          this.y = 0;
          this.β = -sin(β * φ);
          return this;
        };
        G2.prototype.scp = function(m) {
          return this.scp2(this, m);
        };
        G2.prototype.scp2 = function(a, b) {
          this.α = scpE2_1.default(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.α *= α;
          this.x *= α;
          this.y *= α;
          this.β *= α;
          return this;
        };
        G2.prototype.slerp = function(target, α) {
          mustBeObject_1.default('target', target);
          mustBeNumber_1.default('α', α);
          return this;
        };
        G2.prototype.spinor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var bx = b.x;
          var by = b.y;
          this.α = dotVectorE2_1.default(a, b);
          this.x = 0;
          this.y = 0;
          this.β = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
          return this;
        };
        G2.prototype.squaredNorm = function() {
          this.α = this.squaredNormSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.squaredNormSansUnits = function() {
          var w = this.α;
          var x = this.x;
          var y = this.y;
          var B = this.β;
          return w * w + x * x + y * y + B * B;
        };
        G2.prototype.sub = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('M', M);
          mustBeNumber_1.default('α', α);
          this.α -= M.α * α;
          this.x -= M.x * α;
          this.y -= M.y * α;
          this.β -= M.β * α;
          return this;
        };
        G2.prototype.sub2 = function(a, b) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          this.α = a.α - b.α;
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.β = a.β - b.β;
          return this;
        };
        G2.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.toFixed = function(fractionDigits) {
          var coordToString = function(coord) {
            return coord.toFixed(fractionDigits);
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2.BASIS_LABELS);
        };
        G2.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.x = 0;
                this.y = 0;
                this.β = 0;
              }
              break;
            case 1:
              {
                this.α = 0;
                this.β = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.β = 0;
              }
          }
          return this;
        };
        G2.prototype.zero = function() {
          this.α = 0;
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2.prototype.__add__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).add(rhs);
          } else if (typeof rhs === 'number') {
            return G2.fromScalar(rhs).add(this);
          } else {
            var rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
              return rhsCopy.add(this);
            } else {
              return void 0;
            }
          }
        };
        G2.prototype.__div__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).div(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).divByScalar(rhs);
          } else {
            return void 0;
          }
        };
        G2.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).div(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).div(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__mul__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).mul(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).scale(rhs);
          } else {
            var rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
              return this.__mul__(rhsCopy);
            } else {
              return void 0;
            }
          }
        };
        G2.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).mul(this);
          } else if (typeof lhs === 'number') {
            return G2.copy(this).scale(lhs);
          } else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
              return lhsCopy.mul(this);
            } else {
              return void 0;
            }
          }
        };
        G2.prototype.__radd__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).add(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).add(this);
          } else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
              return lhsCopy.add(this);
            } else {
              return void 0;
            }
          }
        };
        G2.prototype.__sub__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).sub(rhs);
          } else if (typeof rhs === 'number') {
            return G2.fromScalar(-rhs).add(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).sub(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).sub(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).ext(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G2.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).ext(this);
          } else if (typeof lhs === 'number') {
            return G2.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G2.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).lco(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).lco(G2.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).lco(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).lco(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).rco(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).rco(G2.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).rco(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).rco(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof G2) {
            return G2.copy(this).scp(rhs);
          } else if (typeof rhs === 'number') {
            return G2.copy(this).scp(G2.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof G2) {
            return G2.copy(lhs).scp(this);
          } else if (typeof lhs === 'number') {
            return G2.fromScalar(lhs).scp(this);
          } else {
            return void 0;
          }
        };
        G2.prototype.__bang__ = function() {
          return G2.copy(this).inv();
        };
        G2.prototype.__tilde__ = function() {
          return G2.copy(this).rev();
        };
        G2.prototype.__pos__ = function() {
          return G2.copy(this);
        };
        G2.prototype.__neg__ = function() {
          return G2.copy(this).neg();
        };
        G2.fromCartesian = function(α, x, y, β) {
          var m = new G2();
          m.α = α;
          m.x = x;
          m.y = y;
          m.β = β;
          return m;
        };
        G2.copy = function(M) {
          var copy = new G2();
          copy.α = M.α;
          copy.x = M.x;
          copy.y = M.y;
          copy.β = M.β;
          return copy;
        };
        G2.fromScalar = function(α) {
          return new G2().addScalar(α);
        };
        G2.fromSpinor = function(spinor) {
          return new G2().copySpinor(spinor);
        };
        G2.fromVector = function(vector) {
          if (isDefined_1.default(vector)) {
            return new G2().copyVector(vector);
          } else {
            return void 0;
          }
        };
        G2.lerp = function(A, B, α) {
          return G2.copy(A).lerp(B, α);
        };
        G2.rotorFromDirections = function(a, b) {
          return new G2().rotorFromDirections(a, b);
        };
        G2.BASIS_LABELS = STANDARD_LABELS;
        G2.zero = G2.fromCartesian(0, 0, 0, 0);
        G2.one = G2.fromCartesian(1, 0, 0, 0);
        G2.e1 = G2.fromCartesian(0, 1, 0, 0);
        G2.e2 = G2.fromCartesian(0, 0, 1, 0);
        G2.I = G2.fromCartesian(0, 0, 0, 1);
        return G2;
      })(VectorN_1.default);
      exports_1("default", G2);
    }
  };
});

System.register("davinci-eight/geometries/dataLength.js", ["../math/G2", "../math/G3", "../math/R2", "../math/R3"], function(exports_1) {
  var G2_1,
      G3_1,
      R2_1,
      R3_1;
  function dataLength(source) {
    if (source instanceof G3_1.default) {
      if (source.length !== 8) {
        throw new Error("source.length is expected to be 8");
      }
      return 3;
    } else if (source instanceof G2_1.default) {
      if (source.length !== 4) {
        throw new Error("source.length is expected to be 4");
      }
      return 2;
    } else if (source instanceof R3_1.default) {
      if (source.length !== 3) {
        throw new Error("source.length is expected to be 3");
      }
      return 3;
    } else if (source instanceof R2_1.default) {
      if (source.length !== 2) {
        throw new Error("source.length is expected to be 2");
      }
      return 2;
    } else {
      return source.length;
    }
  }
  exports_1("default", dataLength);
  return {
    setters: [function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/Vertex.js", [], function(exports_1) {
  var Vertex;
  function stringVectorN(name, vector) {
    if (vector) {
      return name + vector.toString();
    } else {
      return name;
    }
  }
  function stringifyVertex(vertex) {
    var attributes = vertex.attributes;
    var attribsKey = Object.keys(attributes).map(function(name) {
      var vector = attributes[name];
      return stringVectorN(name, vector);
    }).join(' ');
    return attribsKey;
  }
  return {
    setters: [],
    execute: function() {
      Vertex = (function() {
        function Vertex() {
          this.attributes = {};
        }
        Vertex.prototype.toString = function() {
          return stringifyVertex(this);
        };
        return Vertex;
      })();
      exports_1("default", Vertex);
    }
  };
});

System.register("davinci-eight/geometries/Simplex.js", ["../checks/expectArg", "../checks/isInteger", "../geometries/Vertex", "../math/VectorN"], function(exports_1) {
  var expectArg_1,
      isInteger_1,
      Vertex_1,
      VectorN_1;
  var Simplex;
  function checkIntegerArg(name, n, min, max) {
    if (isInteger_1.default(n) && n >= min && n <= max) {
      return n;
    }
    expectArg_1.default(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
  }
  function checkCountArg(count) {
    return checkIntegerArg('count', count, 0, 7);
  }
  function concatReduce(a, b) {
    return a.concat(b);
  }
  function expectArgVectorN(name, vector) {
    return expectArg_1.default(name, vector).toSatisfy(vector instanceof VectorN_1.default, name + ' must be a VectorN').value;
  }
  function lerp(a, b, alpha, data) {
    if (data === void 0) {
      data = [];
    }
    expectArg_1.default('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
    var dims = a.length;
    var i;
    var beta = 1 - alpha;
    for (i = 0; i < dims; i++) {
      data.push(beta * a[i] + alpha * b[i]);
    }
    return data;
  }
  function lerpVertexAttributeMap(a, b, alpha) {
    var attribMap = {};
    var keys = Object.keys(a);
    var keysLength = keys.length;
    for (var k = 0; k < keysLength; k++) {
      var key = keys[k];
      attribMap[key] = lerpVectorN(a[key], b[key], alpha);
    }
    return attribMap;
  }
  function lerpVectorN(a, b, alpha) {
    return new VectorN_1.default(lerp(a.coords, b.coords, alpha));
  }
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isInteger_1_1) {
      isInteger_1 = isInteger_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      Simplex = (function() {
        function Simplex(k) {
          this.vertices = [];
          if (!isInteger_1.default(k)) {
            expectArg_1.default('k', k).toBeNumber();
          }
          var numVertices = k + 1;
          for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex_1.default());
          }
        }
        Object.defineProperty(Simplex.prototype, "k", {
          get: function() {
            return this.vertices.length - 1;
          },
          enumerable: true,
          configurable: true
        });
        Simplex.indices = function(simplex) {
          return simplex.vertices.map(function(vertex) {
            return vertex.index;
          });
        };
        Simplex.boundaryMap = function(simplex) {
          var vertices = simplex.vertices;
          var k = simplex.k;
          if (k === Simplex.TRIANGLE) {
            var line01 = new Simplex(k - 1);
            line01.vertices[0].attributes = simplex.vertices[0].attributes;
            line01.vertices[1].attributes = simplex.vertices[1].attributes;
            var line12 = new Simplex(k - 1);
            line12.vertices[0].attributes = simplex.vertices[1].attributes;
            line12.vertices[1].attributes = simplex.vertices[2].attributes;
            var line20 = new Simplex(k - 1);
            line20.vertices[0].attributes = simplex.vertices[2].attributes;
            line20.vertices[1].attributes = simplex.vertices[0].attributes;
            return [line01, line12, line20];
          } else if (k === Simplex.LINE) {
            var point0 = new Simplex(k - 1);
            point0.vertices[0].attributes = simplex.vertices[0].attributes;
            var point1 = new Simplex(k - 1);
            point1.vertices[0].attributes = simplex.vertices[1].attributes;
            return [point0, point1];
          } else if (k === Simplex.POINT) {
            return [new Simplex(k - 1)];
          } else if (k === Simplex.EMPTY) {
            return [];
          } else {
            throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
          }
        };
        Simplex.subdivideMap = function(simplex) {
          expectArg_1.default('simplex', simplex).toBeObject();
          var divs = [];
          var vertices = simplex.vertices;
          var k = simplex.k;
          if (k === Simplex.TRIANGLE) {
            var a = vertices[0].attributes;
            var b = vertices[1].attributes;
            var c = vertices[2].attributes;
            var m1 = lerpVertexAttributeMap(a, b, 0.5);
            var m2 = lerpVertexAttributeMap(b, c, 0.5);
            var m3 = lerpVertexAttributeMap(c, a, 0.5);
            var face1 = new Simplex(k);
            face1.vertices[0].attributes = c;
            face1.vertices[1].attributes = m3;
            face1.vertices[2].attributes = m2;
            var face2 = new Simplex(k);
            face2.vertices[0].attributes = a;
            face2.vertices[1].attributes = m1;
            face2.vertices[2].attributes = m3;
            var face3 = new Simplex(k);
            face3.vertices[0].attributes = b;
            face3.vertices[1].attributes = m2;
            face3.vertices[2].attributes = m1;
            var face4 = new Simplex(k);
            face4.vertices[0].attributes = m1;
            face4.vertices[1].attributes = m2;
            face4.vertices[2].attributes = m3;
            divs.push(face1);
            divs.push(face2);
            divs.push(face3);
            divs.push(face4);
          } else if (k === Simplex.LINE) {
            var a = vertices[0].attributes;
            var b = vertices[1].attributes;
            var m = lerpVertexAttributeMap(a, b, 0.5);
            var line1 = new Simplex(k);
            line1.vertices[0].attributes = a;
            line1.vertices[1].attributes = m;
            var line2 = new Simplex(k);
            line2.vertices[0].attributes = m;
            line2.vertices[1].attributes = b;
            divs.push(line1);
            divs.push(line2);
          } else if (k === Simplex.POINT) {
            divs.push(simplex);
          } else if (k === Simplex.EMPTY) {} else {
            throw new Error(k + "-simplex is not supported");
          }
          return divs;
        };
        Simplex.boundary = function(simplices, count) {
          if (count === void 0) {
            count = 1;
          }
          checkCountArg(count);
          for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
          }
          return simplices;
        };
        Simplex.subdivide = function(simplices, count) {
          if (count === void 0) {
            count = 1;
          }
          checkCountArg(count);
          for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
          }
          return simplices;
        };
        Simplex.setAttributeValues = function(attributes, simplex) {
          var names = Object.keys(attributes);
          var attribsLength = names.length;
          var attribIndex;
          for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
            var name_1 = names[attribIndex];
            var values = attributes[name_1];
            var valuesLength = values.length;
            var valueIndex = void 0;
            for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
              simplex.vertices[valueIndex].attributes[name_1] = values[valueIndex];
            }
          }
        };
        Simplex.EMPTY = -1;
        Simplex.POINT = 0;
        Simplex.LINE = 1;
        Simplex.TRIANGLE = 2;
        Simplex.TETRAHEDRON = 3;
        Simplex.FIVE_CELL = 4;
        return Simplex;
      })();
      exports_1("default", Simplex);
    }
  };
});

System.register("davinci-eight/geometries/simplicesToGeometryMeta.js", ["../geometries/dataLength", "../checks/expectArg", "../checks/isDefined", "../geometries/Simplex"], function(exports_1) {
  var dataLength_1,
      expectArg_1,
      isDefined_1,
      Simplex_1;
  function stringify(thing, space) {
    var cache = [];
    return JSON.stringify(thing, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return;
        }
        cache.push(value);
      }
      return value;
    }, space);
    cache = null;
  }
  function simplicesToGeometryMeta(geometry) {
    var kValueOfSimplex = void 0;
    var knowns = {};
    var geometryLen = geometry.length;
    for (var i = 0; i < geometryLen; i++) {
      var simplex = geometry[i];
      if (!(simplex instanceof Simplex_1.default)) {
        expectArg_1.default('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
      }
      var vertices = simplex.vertices;
      kValueOfSimplex = simplex.k;
      for (var j = 0,
          vsLen = vertices.length; j < vsLen; j++) {
        var vertex = vertices[j];
        var attributes = vertex.attributes;
        var keys = Object.keys(attributes);
        var keysLen = keys.length;
        for (var k = 0; k < keysLen; k++) {
          var key = keys[k];
          var value = attributes[key];
          var dLength = dataLength_1.default(value);
          var known = knowns[key];
          if (known) {
            if (known.size !== dLength) {
              throw new Error("Something is rotten in Denmark!");
            }
          } else {
            knowns[key] = {size: dLength};
          }
        }
      }
    }
    if (isDefined_1.default(kValueOfSimplex)) {
      var info = {
        get attributes() {
          return knowns;
        },
        get k() {
          return kValueOfSimplex;
        }
      };
      return info;
    } else {
      return void 0;
    }
  }
  exports_1("default", simplicesToGeometryMeta);
  return {
    setters: [function(dataLength_1_1) {
      dataLength_1 = dataLength_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/R1.js", ["../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var VectorN_1;
  var exp,
      log,
      sqrt,
      COORD_X,
      R1;
  return {
    setters: [function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      exp = Math.exp;
      log = Math.log;
      sqrt = Math.sqrt;
      COORD_X = 0;
      R1 = (function(_super) {
        __extends(R1, _super);
        function R1(data, modified) {
          if (data === void 0) {
            data = [0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 1);
        }
        Object.defineProperty(R1.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        R1.prototype.set = function(x) {
          this.x = x;
          return this;
        };
        R1.prototype.add = function(vector, alpha) {
          if (alpha === void 0) {
            alpha = 1;
          }
          this.x += vector.x * alpha;
          return this;
        };
        R1.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          return this;
        };
        R1.prototype.scp = function(v) {
          return this;
        };
        R1.prototype.adj = function() {
          throw new Error('TODO: R1.adj');
        };
        R1.prototype.conj = function() {
          return this;
        };
        R1.prototype.copy = function(v) {
          this.x = v.x;
          return this;
        };
        R1.prototype.det = function() {
          return this.x;
        };
        R1.prototype.dual = function() {
          return this;
        };
        R1.prototype.exp = function() {
          this.x = exp(this.x);
          return this;
        };
        R1.prototype.one = function() {
          this.x = 1;
          return this;
        };
        R1.prototype.inv = function() {
          this.x = 1 / this.x;
          return this;
        };
        R1.prototype.lco = function(v) {
          return this;
        };
        R1.prototype.log = function() {
          this.x = log(this.x);
          return this;
        };
        R1.prototype.mul = function(v) {
          this.x *= v.x;
          return this;
        };
        R1.prototype.norm = function() {
          return this;
        };
        R1.prototype.div = function(v) {
          this.x /= v.x;
          return this;
        };
        R1.prototype.divByScalar = function(scalar) {
          this.x /= scalar;
          return this;
        };
        R1.prototype.min = function(v) {
          if (this.x > v.x) {
            this.x = v.x;
          }
          return this;
        };
        R1.prototype.max = function(v) {
          if (this.x < v.x) {
            this.x = v.x;
          }
          return this;
        };
        R1.prototype.floor = function() {
          this.x = Math.floor(this.x);
          return this;
        };
        R1.prototype.ceil = function() {
          this.x = Math.ceil(this.x);
          return this;
        };
        R1.prototype.rev = function() {
          return this;
        };
        R1.prototype.rco = function(v) {
          return this;
        };
        R1.prototype.round = function() {
          this.x = Math.round(this.x);
          return this;
        };
        R1.prototype.roundToZero = function() {
          this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          return this;
        };
        R1.prototype.scale = function(scalar) {
          this.x *= scalar;
          return this;
        };
        R1.prototype.sub = function(v) {
          this.x -= v.x;
          return this;
        };
        R1.prototype.subScalar = function(s) {
          this.x -= s;
          return this;
        };
        R1.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          return this;
        };
        R1.prototype.neg = function() {
          this.x = -this.x;
          return this;
        };
        R1.prototype.distanceTo = function(position) {
          return sqrt(this.quadranceTo(position));
        };
        R1.prototype.dot = function(v) {
          return this.x * v.x;
        };
        R1.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        R1.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        R1.prototype.mul2 = function(a, b) {
          return this;
        };
        R1.prototype.quad = function() {
          var x = this.x;
          this.x = x * x;
          return this;
        };
        R1.prototype.squaredNorm = function() {
          return this.x * this.x;
        };
        R1.prototype.quadranceTo = function(position) {
          var dx = this.x - position.x;
          return dx * dx;
        };
        R1.prototype.reflect = function(n) {
          return this;
        };
        R1.prototype.reflection = function(n) {
          return this;
        };
        R1.prototype.rotate = function(rotor) {
          return this;
        };
        R1.prototype.lerp = function(v, α) {
          this.x += (v.x - this.x) * α;
          return this;
        };
        R1.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        R1.prototype.equals = function(v) {
          return v.x === this.x;
        };
        R1.prototype.fromArray = function(array, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          this.x = array[offset];
          return this;
        };
        R1.prototype.slerp = function(v, α) {
          return this;
        };
        R1.prototype.toArray = function(array, offset) {
          if (array === void 0) {
            array = [];
          }
          if (offset === void 0) {
            offset = 0;
          }
          array[offset] = this.x;
          return array;
        };
        R1.prototype.toExponential = function() {
          return "TODO: R1.toExponential";
        };
        R1.prototype.toFixed = function(digits) {
          return "TODO: R1.toFixed";
        };
        R1.prototype.translation = function(d) {
          return this.one();
        };
        R1.prototype.fromAttribute = function(attribute, index, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[index];
          return this;
        };
        R1.prototype.clone = function() {
          return new R1([this.x]);
        };
        R1.prototype.ext = function(v) {
          return this;
        };
        R1.prototype.zero = function() {
          this.x = 0;
          return this;
        };
        return R1;
      })(VectorN_1.default);
      exports_1("default", R1);
    }
  };
});

System.register("davinci-eight/geometries/SimplexGeometry.js", ["../math/Euclidean3", "../checks/mustBeBoolean", "../checks/mustBeInteger", "../geometries/Geometry", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../geometries/simplicesToDrawPrimitive", "../geometries/simplicesToGeometryMeta", "../math/R1", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Euclidean3_1,
      mustBeBoolean_1,
      mustBeInteger_1,
      Geometry_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      simplicesToDrawPrimitive_1,
      simplicesToGeometryMeta_1,
      R1_1,
      R3_1;
  var SimplexGeometry;
  return {
    setters: [function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(Geometry_1_1) {
      Geometry_1 = Geometry_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(simplicesToDrawPrimitive_1_1) {
      simplicesToDrawPrimitive_1 = simplicesToDrawPrimitive_1_1;
    }, function(simplicesToGeometryMeta_1_1) {
      simplicesToGeometryMeta_1 = simplicesToGeometryMeta_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      SimplexGeometry = (function(_super) {
        __extends(SimplexGeometry, _super);
        function SimplexGeometry() {
          _super.call(this);
          this.data = [];
          this._k = new R1_1.default([Simplex_1.default.TRIANGLE]);
          this.curvedSegments = 16;
          this.flatSegments = 1;
          this.orientationColors = false;
          this._k.modified = true;
        }
        Object.defineProperty(SimplexGeometry.prototype, "k", {
          get: function() {
            return this._k.x;
          },
          set: function(k) {
            this._k.x = mustBeInteger_1.default('k', k);
          },
          enumerable: true,
          configurable: true
        });
        SimplexGeometry.prototype.regenerate = function() {
          console.warn("`public regenerate(): void` method should be implemented in derived class.");
        };
        SimplexGeometry.prototype.isModified = function() {
          return this._k.modified;
        };
        SimplexGeometry.prototype.setModified = function(modified) {
          mustBeBoolean_1.default('modified', modified);
          this._k.modified = modified;
          return this;
        };
        SimplexGeometry.prototype.boundary = function(times) {
          if (this.isModified()) {
            this.regenerate();
          }
          this.data = Simplex_1.default.boundary(this.data, times);
          return this.check();
        };
        SimplexGeometry.prototype.check = function() {
          this.meta = simplicesToGeometryMeta_1.default(this.data);
          return this;
        };
        SimplexGeometry.prototype.subdivide = function(times) {
          if (this.isModified()) {
            this.regenerate();
          }
          this.data = Simplex_1.default.subdivide(this.data, times);
          this.check();
          return this;
        };
        SimplexGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        SimplexGeometry.prototype.toPrimitives = function() {
          if (this.isModified()) {
            this.regenerate();
          }
          this.check();
          return [simplicesToDrawPrimitive_1.default(this.data, this.meta)];
        };
        SimplexGeometry.prototype.mergeVertices = function(precisionPoints) {
          if (precisionPoints === void 0) {
            precisionPoints = 4;
          }
        };
        SimplexGeometry.prototype.triangle = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[2];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[2];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e2);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e3);
          }
          return this.data.push(simplex);
        };
        SimplexGeometry.prototype.lineSegment = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.LINE);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e2);
          }
          return this.data.push(simplex);
        };
        SimplexGeometry.prototype.point = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.POINT);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
          }
          return this.data.push(simplex);
        };
        SimplexGeometry.prototype.empty = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
          return this.data.push(simplex);
        };
        SimplexGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return SimplexGeometry;
      })(Geometry_1.default);
      exports_1("default", SimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/AxialSimplexGeometry.js", ["../math/CartesianE3", "../checks/mustBeObject", "../geometries/SimplexGeometry"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var CartesianE3_1,
      mustBeObject_1,
      SimplexGeometry_1;
  var AxialSimplexGeometry;
  return {
    setters: [function(CartesianE3_1_1) {
      CartesianE3_1 = CartesianE3_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(SimplexGeometry_1_1) {
      SimplexGeometry_1 = SimplexGeometry_1_1;
    }],
    execute: function() {
      AxialSimplexGeometry = (function(_super) {
        __extends(AxialSimplexGeometry, _super);
        function AxialSimplexGeometry(axis) {
          _super.call(this);
          this.setAxis(axis);
        }
        AxialSimplexGeometry.prototype.setAxis = function(axis) {
          mustBeObject_1.default('axis', axis);
          this.axis = CartesianE3_1.default.direction(axis);
          return this;
        };
        AxialSimplexGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        AxialSimplexGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return AxialSimplexGeometry;
      })(SimplexGeometry_1.default);
      exports_1("default", AxialSimplexGeometry);
    }
  };
});

System.register("davinci-eight/geometries/SliceSimplexGeometry.js", ["../geometries/AxialSimplexGeometry", "../checks/isDefined", "../checks/mustBeNumber", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialSimplexGeometry_1,
      isDefined_1,
      mustBeNumber_1,
      R3_1;
  var SliceSimplexGeometry;
  function perpendicular(axis) {
    return R3_1.default.random().cross(axis).direction();
  }
  return {
    setters: [function(AxialSimplexGeometry_1_1) {
      AxialSimplexGeometry_1 = AxialSimplexGeometry_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      SliceSimplexGeometry = (function(_super) {
        __extends(SliceSimplexGeometry, _super);
        function SliceSimplexGeometry(axis, sliceStart, sliceAngle) {
          if (axis === void 0) {
            axis = R3_1.default.e3;
          }
          if (sliceAngle === void 0) {
            sliceAngle = 2 * Math.PI;
          }
          _super.call(this, axis);
          this.sliceAngle = 2 * Math.PI;
          if (isDefined_1.default(sliceStart)) {
            this.sliceStart = R3_1.default.copy(sliceStart).direction();
          } else {
            this.sliceStart = perpendicular(this.axis);
          }
          this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
        }
        return SliceSimplexGeometry;
      })(AxialSimplexGeometry_1.default);
      exports_1("default", SliceSimplexGeometry);
    }
  };
});

System.register("davinci-eight/math/R2.js", ["../geometries/b2", "../geometries/b3", "../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var b2_1,
      b3_1,
      VectorN_1;
  var sqrt,
      COORD_X,
      COORD_Y,
      R2;
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      sqrt = Math.sqrt;
      COORD_X = 0;
      COORD_Y = 1;
      R2 = (function(_super) {
        __extends(R2, _super);
        function R2(data, modified) {
          if (data === void 0) {
            data = [0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 2);
        }
        Object.defineProperty(R2.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R2.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[COORD_Y] = value;
          },
          enumerable: true,
          configurable: true
        });
        R2.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          return this;
        };
        R2.prototype.add = function(v, alpha) {
          if (alpha === void 0) {
            alpha = 1;
          }
          this.x += v.x * alpha;
          this.y += v.y * alpha;
          return this;
        };
        R2.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          return this;
        };
        R2.prototype.applyMatrix = function(m) {
          var x = this.x;
          var y = this.y;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x2] * y;
          this.y = e[0x1] * x + e[0x3] * y;
          return this;
        };
        R2.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          this.x = x;
          this.y = y;
          return this;
        };
        R2.prototype.sub = function(v) {
          this.x -= v.x;
          this.y -= v.y;
          return this;
        };
        R2.prototype.subScalar = function(s) {
          this.x -= s;
          this.y -= s;
          return this;
        };
        R2.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          return this;
        };
        R2.prototype.scale = function(s) {
          this.x *= s;
          this.y *= s;
          return this;
        };
        R2.prototype.divByScalar = function(scalar) {
          if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
          } else {
            this.x = 0;
            this.y = 0;
          }
          return this;
        };
        R2.prototype.min = function(v) {
          if (this.x > v.x) {
            this.x = v.x;
          }
          if (this.y > v.y) {
            this.y = v.y;
          }
          return this;
        };
        R2.prototype.max = function(v) {
          if (this.x < v.x) {
            this.x = v.x;
          }
          if (this.y < v.y) {
            this.y = v.y;
          }
          return this;
        };
        R2.prototype.floor = function() {
          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          return this;
        };
        R2.prototype.ceil = function() {
          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          return this;
        };
        R2.prototype.round = function() {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
        };
        R2.prototype.roundToZero = function() {
          this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
          return this;
        };
        R2.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          return this;
        };
        R2.prototype.distanceTo = function(position) {
          return sqrt(this.quadranceTo(position));
        };
        R2.prototype.dot = function(v) {
          return this.x * v.x + this.y * v.y;
        };
        R2.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        R2.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        R2.prototype.squaredNorm = function() {
          return this.x * this.x + this.y * this.y;
        };
        R2.prototype.quadranceTo = function(position) {
          var dx = this.x - position.x;
          var dy = this.y - position.y;
          return dx * dx + dy * dy;
        };
        R2.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          this.x = x;
          this.y = y;
          return this;
        };
        R2.prototype.reflect = function(n) {
          return this;
        };
        R2.prototype.rotate = function(rotor) {
          return this;
        };
        R2.prototype.lerp = function(v, α) {
          this.x += (v.x - this.x) * α;
          this.y += (v.y - this.y) * α;
          return this;
        };
        R2.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        R2.prototype.equals = function(v) {
          return ((v.x === this.x) && (v.y === this.y));
        };
        R2.prototype.slerp = function(v, α) {
          return this;
        };
        R2.prototype.toExponential = function() {
          return "TODO: R2.toExponential";
        };
        R2.prototype.toFixed = function(digits) {
          return "TODO: R2.toString";
        };
        R2.prototype.fromArray = function(array, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          this.x = array[offset];
          this.y = array[offset + 1];
          return this;
        };
        R2.prototype.fromAttribute = function(attribute, index, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[index];
          this.y = attribute.array[index + 1];
          return this;
        };
        R2.prototype.clone = function() {
          return new R2([this.x, this.y]);
        };
        R2.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          return this;
        };
        R2.copy = function(vector) {
          return new R2([vector.x, vector.y]);
        };
        R2.lerp = function(a, b, α) {
          return R2.copy(b).sub(a).scale(α).add(a);
        };
        R2.random = function() {
          return new R2([Math.random(), Math.random()]);
        };
        return R2;
      })(VectorN_1.default);
      exports_1("default", R2);
    }
  };
});

System.register("davinci-eight/geometries/SphereGeometry.js", ["../geometries/arc3", "../checks/mustBeNumber", "../math/R1", "../geometries/Simplex", "../geometries/SliceSimplexGeometry", "../math/SpinG3", "../math/R2", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var arc3_1,
      mustBeNumber_1,
      R1_1,
      Simplex_1,
      SliceSimplexGeometry_1,
      SpinG3_1,
      R2_1,
      R3_1;
  var SphereGeometry;
  function computeVertices(radius, axis, phiStart, phiLength, thetaStart, thetaLength, heightSegments, widthSegments, points, uvs) {
    var generator = SpinG3_1.default.dual(axis);
    var iLength = heightSegments + 1;
    var jLength = widthSegments + 1;
    for (var i = 0; i < iLength; i++) {
      var v = i / heightSegments;
      var θ = thetaStart + v * thetaLength;
      var arcRadius = radius * Math.sin(θ);
      var begin = R3_1.default.copy(phiStart).scale(arcRadius);
      var arcPoints = arc3_1.default(begin, phiLength, generator, widthSegments);
      var cosθ = Math.cos(θ);
      var displacement = radius * cosθ;
      for (var j = 0; j < jLength; j++) {
        var u = j / widthSegments;
        var point = arcPoints[j].add(axis, displacement);
        points.push(point);
        uvs.push(new R2_1.default([u, 1 - v]));
      }
    }
  }
  function quadIndex(i, j, innerSegments) {
    return i * (innerSegments + 1) + j;
  }
  function vertexIndex(qIndex, n, innerSegments) {
    switch (n) {
      case 0:
        return qIndex + 1;
      case 1:
        return qIndex;
      case 2:
        return qIndex + innerSegments + 1;
      case 3:
        return qIndex + innerSegments + 2;
    }
  }
  function makeTriangles(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = R3_1.default.copy(points[v0]).direction();
        var n1 = R3_1.default.copy(points[v1]).direction();
        var n2 = R3_1.default.copy(points[v2]).direction();
        var n3 = R3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
          geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
        }
      }
    }
  }
  function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = R3_1.default.copy(points[v0]).direction();
        var n1 = R3_1.default.copy(points[v1]).direction();
        var n2 = R3_1.default.copy(points[v2]).direction();
        var n3 = R3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
          geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
          geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
          geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
        }
      }
    }
  }
  function makePoints(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = R3_1.default.copy(points[v0]).direction();
        var n1 = R3_1.default.copy(points[v1]).direction();
        var n2 = R3_1.default.copy(points[v2]).direction();
        var n3 = R3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.point([points[v0]], [n0], [uv0]);
          geometry.point([points[v1]], [n1], [uv1]);
          geometry.point([points[v2]], [n2], [uv2]);
          geometry.point([points[v3]], [n3], [uv3]);
        }
      }
    }
  }
  return {
    setters: [function(arc3_1_1) {
      arc3_1 = arc3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(SliceSimplexGeometry_1_1) {
      SliceSimplexGeometry_1 = SliceSimplexGeometry_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      SphereGeometry = (function(_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(radius, axis, phiStart, phiLength, thetaStart, thetaLength) {
          if (radius === void 0) {
            radius = 1;
          }
          if (phiLength === void 0) {
            phiLength = 2 * Math.PI;
          }
          if (thetaStart === void 0) {
            thetaStart = 0;
          }
          if (thetaLength === void 0) {
            thetaLength = Math.PI;
          }
          _super.call(this, axis, phiStart, phiLength);
          this._radius = new R1_1.default([radius]);
          this.thetaLength = thetaLength;
          this.thetaStart = thetaStart;
          this.setModified(true);
          this.regenerate();
        }
        Object.defineProperty(SphereGeometry.prototype, "radius", {
          get: function() {
            return this._radius.x;
          },
          set: function(radius) {
            this._radius.x = mustBeNumber_1.default('radius', radius);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "phiLength", {
          get: function() {
            return this.sliceAngle;
          },
          set: function(phiLength) {
            this.sliceAngle = phiLength;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "phiStart", {
          get: function() {
            return this.sliceStart;
          },
          set: function(phiStart) {
            this.sliceStart.copy(phiStart);
          },
          enumerable: true,
          configurable: true
        });
        SphereGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        SphereGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        SphereGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        SphereGeometry.prototype.isModified = function() {
          return this._radius.modified || _super.prototype.isModified.call(this);
        };
        SphereGeometry.prototype.setModified = function(modified) {
          _super.prototype.setModified.call(this, modified);
          this._radius.modified = modified;
          return this;
        };
        SphereGeometry.prototype.regenerate = function() {
          this.data = [];
          var heightSegments = this.curvedSegments;
          var widthSegments = this.curvedSegments;
          var points = [];
          var uvs = [];
          computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs);
          switch (this.k) {
            case Simplex_1.default.EMPTY:
              {
                makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.POINT:
              {
                makePoints(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.LINE:
              {
                makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.TRIANGLE:
              {
                makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            default:
              {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
              }
          }
          this.setModified(false);
        };
        return SphereGeometry;
      })(SliceSimplexGeometry_1.default);
      exports_1("default", SphereGeometry);
    }
  };
});

System.register("davinci-eight/visual/visualCache.js", ["../geometries/ArrowGeometry", "../geometries/CuboidGeometry", "../geometries/CylinderSimplexGeometry", "../scene/GraphicsBuffers", "../materials/MeshLambertMaterial", "../math/G3", "../geometries/SphereGeometry"], function(exports_1) {
  var ArrowGeometry_1,
      CuboidGeometry_1,
      CylinderSimplexGeometry_1,
      GraphicsBuffers_1,
      MeshLambertMaterial_1,
      G3_1,
      SphereGeometry_1;
  var VisualCache,
      visualCache;
  function arrow() {
    var geometry = new ArrowGeometry_1.default(G3_1.default.e2);
    var primitives = geometry.toPrimitives();
    return new GraphicsBuffers_1.default(primitives);
  }
  function box() {
    var geometry = new CuboidGeometry_1.default();
    var primitives = geometry.toPrimitives();
    return new GraphicsBuffers_1.default(primitives);
  }
  function cylinder() {
    var geometry = new CylinderSimplexGeometry_1.default();
    var primitives = geometry.toPrimitives();
    return new GraphicsBuffers_1.default(primitives);
  }
  function sphere() {
    var geometry = new SphereGeometry_1.default(1, G3_1.default.e2);
    var primitives = geometry.toPrimitives();
    return new GraphicsBuffers_1.default(primitives);
  }
  return {
    setters: [function(ArrowGeometry_1_1) {
      ArrowGeometry_1 = ArrowGeometry_1_1;
    }, function(CuboidGeometry_1_1) {
      CuboidGeometry_1 = CuboidGeometry_1_1;
    }, function(CylinderSimplexGeometry_1_1) {
      CylinderSimplexGeometry_1 = CylinderSimplexGeometry_1_1;
    }, function(GraphicsBuffers_1_1) {
      GraphicsBuffers_1 = GraphicsBuffers_1_1;
    }, function(MeshLambertMaterial_1_1) {
      MeshLambertMaterial_1 = MeshLambertMaterial_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(SphereGeometry_1_1) {
      SphereGeometry_1 = SphereGeometry_1_1;
    }],
    execute: function() {
      VisualCache = (function() {
        function VisualCache() {
          this.buffersMap = {};
        }
        VisualCache.prototype.isZombieOrMissing = function(key) {
          var buffers = this.buffersMap[key];
          if (buffers) {
            return buffers.isZombie();
          } else {
            return true;
          }
        };
        VisualCache.prototype.ensureBuffers = function(key, factory) {
          if (this.isZombieOrMissing(key)) {
            this.buffersMap[key] = factory();
          } else {
            this.buffersMap[key].addRef();
          }
          return this.buffersMap[key];
        };
        VisualCache.prototype.arrow = function() {
          return this.ensureBuffers('arrow', arrow);
        };
        VisualCache.prototype.box = function() {
          return this.ensureBuffers('box', box);
        };
        VisualCache.prototype.cylinder = function() {
          return this.ensureBuffers('cylinder', cylinder);
        };
        VisualCache.prototype.sphere = function() {
          return this.ensureBuffers('sphere', sphere);
        };
        VisualCache.prototype.program = function() {
          if (this._program) {
            if (this._program.isZombie()) {
              this._program = new MeshLambertMaterial_1.default();
            } else {
              this._program.addRef();
            }
          } else {
            this._program = new MeshLambertMaterial_1.default();
          }
          return this._program;
        };
        return VisualCache;
      })();
      visualCache = new VisualCache();
      exports_1("default", visualCache);
    }
  };
});

System.register("davinci-eight/core/cleanUp.js", [], function(exports_1) {
  function cleanUp(context, consumer) {
    if (context) {
      var gl = context.gl;
      if (gl) {
        if (gl.isContextLost()) {
          consumer.contextLost();
        } else {
          consumer.contextFree(context);
        }
      }
    }
  }
  exports_1("default", cleanUp);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/ShareableContextListener.js", ["./cleanUp", "../i18n/readOnly", "./Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var cleanUp_1,
      readOnly_1,
      Shareable_1;
  var ShareableContextListener;
  return {
    setters: [function(cleanUp_1_1) {
      cleanUp_1 = cleanUp_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ShareableContextListener = (function(_super) {
        __extends(ShareableContextListener, _super);
        function ShareableContextListener(type) {
          _super.call(this, type);
        }
        ShareableContextListener.prototype.destructor = function() {
          this.detachFromMonitor();
          if (this._context) {
            cleanUp_1.default(this._context, this);
          }
          _super.prototype.destructor.call(this);
        };
        ShareableContextListener.prototype.attachToMonitor = function(monitor) {
          if (!this._monitor) {
            monitor.addRef();
            this._monitor = monitor;
            monitor.addContextListener(this);
          } else {
            this.detachFromMonitor();
            this.attachToMonitor(monitor);
          }
        };
        ShareableContextListener.prototype.detachFromMonitor = function() {
          if (this._monitor) {
            this._monitor.removeContextListener(this);
            this._monitor.release();
            this._monitor = void 0;
          }
        };
        ShareableContextListener.prototype.contextFree = function(context) {
          this._context = void 0;
        };
        ShareableContextListener.prototype.contextGain = function(context) {
          this._context = context;
        };
        ShareableContextListener.prototype.contextLost = function() {
          this._context = void 0;
        };
        Object.defineProperty(ShareableContextListener.prototype, "gl", {
          get: function() {
            if (this._context) {
              return this._context.gl;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('gl').message);
          },
          enumerable: true,
          configurable: true
        });
        return ShareableContextListener;
      })(Shareable_1.default);
      exports_1("default", ShareableContextListener);
    }
  };
});

System.register("davinci-eight/collections/StringIUnknownMap.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var StringIUnknownMap;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      StringIUnknownMap = (function(_super) {
        __extends(StringIUnknownMap, _super);
        function StringIUnknownMap() {
          _super.call(this, 'StringIUnknownMap');
          this.elements = {};
        }
        StringIUnknownMap.prototype.destructor = function() {
          var _this = this;
          this.forEach(function(key) {
            _this.putWeakRef(key, void 0);
          });
          _super.prototype.destructor.call(this);
        };
        StringIUnknownMap.prototype.exists = function(key) {
          var element = this.elements[key];
          return element ? true : false;
        };
        StringIUnknownMap.prototype.get = function(key) {
          var element = this.elements[key];
          if (element) {
            element.addRef();
            return element;
          } else {
            return void 0;
          }
        };
        StringIUnknownMap.prototype.getWeakRef = function(key) {
          return this.elements[key];
        };
        StringIUnknownMap.prototype.put = function(key, value) {
          if (value) {
            value.addRef();
          }
          this.putWeakRef(key, value);
        };
        StringIUnknownMap.prototype.putWeakRef = function(key, value) {
          var elements = this.elements;
          var existing = elements[key];
          if (existing) {
            existing.release();
          }
          elements[key] = value;
        };
        StringIUnknownMap.prototype.forEach = function(callback) {
          var keys = this.keys;
          for (var i = 0,
              iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            callback(key, this.elements[key]);
          }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
          get: function() {
            return Object.keys(this.elements);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
          get: function() {
            var values = [];
            var keys = this.keys;
            for (var i = 0,
                iLength = keys.length; i < iLength; i++) {
              var key = keys[i];
              values.push(this.elements[key]);
            }
            return values;
          },
          enumerable: true,
          configurable: true
        });
        StringIUnknownMap.prototype.remove = function(key) {
          var value = this.elements[key];
          delete this.elements[key];
          return value;
        };
        return StringIUnknownMap;
      })(Shareable_1.default);
      exports_1("default", StringIUnknownMap);
    }
  };
});

System.register("davinci-eight/scene/Composite.js", ["../i18n/readOnly", "../core/ShareableContextListener", "../collections/StringIUnknownMap"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var readOnly_1,
      ShareableContextListener_1,
      StringIUnknownMap_1;
  var Composite;
  return {
    setters: [function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }, function(StringIUnknownMap_1_1) {
      StringIUnknownMap_1 = StringIUnknownMap_1_1;
    }],
    execute: function() {
      Composite = (function(_super) {
        __extends(Composite, _super);
        function Composite(buffers, program, type) {
          _super.call(this, type);
          this._buffers = buffers;
          this._buffers.addRef();
          this._program = program;
          this._program.addRef();
          this._facets = new StringIUnknownMap_1.default();
        }
        Composite.prototype.destructor = function() {
          this._buffers.release();
          this._buffers = void 0;
          this._program.release();
          this._program = void 0;
          this._facets.release();
          this._facets = void 0;
          _super.prototype.destructor.call(this);
        };
        Composite.prototype.setUniforms = function() {
          var program = this._program;
          var facets = this._facets;
          var keys = facets.keys;
          var keysLength = keys.length;
          for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var facet = facets.getWeakRef(key);
            facet.setUniforms(program);
          }
        };
        Composite.prototype.draw = function(ambients) {
          var program = this._program;
          program.use();
          var iL = ambients.length;
          for (var i = 0; i < iL; i++) {
            var ambient = ambients[i];
            ambient.setUniforms(program);
          }
          this.setUniforms();
          var buffers = this._buffers;
          var jL = buffers.length;
          for (var j = 0; j < jL; j++) {
            var buffer = buffers.getWeakRef(j);
            buffer.draw(program);
          }
        };
        Composite.prototype.contextFree = function(manager) {
          this._buffers.contextFree(manager);
          this._program.contextFree(manager);
        };
        Composite.prototype.contextGain = function(manager) {
          this._buffers.contextGain(manager);
          this._program.contextGain(manager);
        };
        Composite.prototype.contextLost = function() {
          this._buffers.contextLost();
          this._program.contextLost();
        };
        Composite.prototype.getFacet = function(name) {
          return this._facets.get(name);
        };
        Composite.prototype.setFacet = function(name, facet) {
          this._facets.put(name, facet);
        };
        Object.defineProperty(Composite.prototype, "buffers", {
          get: function() {
            this._buffers.addRef();
            return this._buffers;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('buffers').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Composite.prototype, "program", {
          get: function() {
            this._program.addRef();
            return this._program;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('program').message);
          },
          enumerable: true,
          configurable: true
        });
        return Composite;
      })(ShareableContextListener_1.default);
      exports_1("default", Composite);
    }
  };
});

System.register("davinci-eight/math/clamp.js", ["../checks/mustBeNumber"], function(exports_1) {
  var mustBeNumber_1;
  function clamp(x, min, max) {
    mustBeNumber_1.default('x', x);
    mustBeNumber_1.default('min', min);
    mustBeNumber_1.default('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
  }
  exports_1("default", clamp);
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/principalAngle.js", [], function(exports_1) {
  function principalAngle(angle) {
    if (angle > 2 * Math.PI) {
      return principalAngle(angle - 2 * Math.PI);
    } else if (angle < 0) {
      return principalAngle(angle + 2 * Math.PI);
    } else {
      return angle;
    }
  }
  exports_1("default", principalAngle);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/Color.js", ["../math/clamp", "../checks/mustBeArray", "../checks/mustBeNumber", "./principalAngle", "../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var clamp_1,
      mustBeArray_1,
      mustBeNumber_1,
      principalAngle_1,
      VectorN_1;
  var pow,
      COORD_R,
      COORD_G,
      COORD_B,
      Color;
  return {
    setters: [function(clamp_1_1) {
      clamp_1 = clamp_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(principalAngle_1_1) {
      principalAngle_1 = principalAngle_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      pow = Math.pow;
      COORD_R = 0;
      COORD_G = 1;
      COORD_B = 2;
      Color = (function(_super) {
        __extends(Color, _super);
        function Color(r, g, b) {
          _super.call(this, [r, g, b], false, 3);
        }
        Object.defineProperty(Color.prototype, "r", {
          get: function() {
            return this.coords[COORD_R];
          },
          set: function(r) {
            this.coords[COORD_R] = clamp_1.default(r, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
          get: function() {
            return this.coords[COORD_G];
          },
          set: function(g) {
            this.coords[COORD_G] = clamp_1.default(g, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
          get: function() {
            return this.coords[COORD_B];
          },
          set: function(b) {
            this.coords[COORD_B] = clamp_1.default(b, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Color.prototype.clone = function() {
          return new Color(this.r, this.g, this.b);
        };
        Color.prototype.copy = function(color) {
          this.r = color.r;
          this.g = color.g;
          this.b = color.b;
          return this;
        };
        Color.prototype.interpolate = function(target, α) {
          this.r += (target.r - this.r) * α;
          this.g += (target.g - this.g) * α;
          this.b += (target.b - this.b) * α;
          return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
          get: function() {
            return Color.luminance(this.r, this.g, this.b);
          },
          enumerable: true,
          configurable: true
        });
        Color.prototype.toString = function() {
          return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.luminance = function(r, g, b) {
          mustBeNumber_1.default('r', r);
          mustBeNumber_1.default('g', g);
          mustBeNumber_1.default('b', b);
          var γ = 2.2;
          return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        Color.fromColor = function(color) {
          return new Color(color.r, color.g, color.b);
        };
        Color.fromCoords = function(coords) {
          mustBeArray_1.default('coords', coords);
          var r = mustBeNumber_1.default('r', coords[COORD_R]);
          var g = mustBeNumber_1.default('g', coords[COORD_G]);
          var b = mustBeNumber_1.default('b', coords[COORD_B]);
          return new Color(r, g, b);
        };
        Color.fromHSL = function(H, S, L) {
          mustBeNumber_1.default('H', H);
          mustBeNumber_1.default('S', S);
          mustBeNumber_1.default('L', L);
          var C = (1 - Math.abs(2 * L - 1)) * S;
          function matchLightness(R, G, B) {
            var m = L - 0.5 * C;
            return new Color(R + m, G + m, B + m);
          }
          var sextant = ((principalAngle_1.default(H) / Math.PI) * 3) % 6;
          var X = C * (1 - Math.abs(sextant % 2 - 1));
          if (sextant >= 0 && sextant < 1) {
            return matchLightness(C, X, 0);
          } else if (sextant >= 1 && sextant < 2) {
            return matchLightness(X, C, 0);
          } else if (sextant >= 2 && sextant < 3) {
            return matchLightness(0, C, C * (sextant - 2));
          } else if (sextant >= 3 && sextant < 4) {
            return matchLightness(0, C * (4 - sextant), C);
          } else if (sextant >= 4 && sextant < 5) {
            return matchLightness(X, 0, C);
          } else if (sextant >= 5 && sextant < 6) {
            return matchLightness(C, 0, X);
          } else {
            return matchLightness(0, 0, 0);
          }
        };
        Color.fromRGB = function(r, g, b) {
          mustBeNumber_1.default('r', r);
          mustBeNumber_1.default('g', g);
          mustBeNumber_1.default('b', b);
          return new Color(r, g, b);
        };
        Color.interpolate = function(a, b, α) {
          return Color.fromColor(a).interpolate(b, α);
        };
        Color.black = new Color(0, 0, 0);
        Color.blue = new Color(0, 0, 1);
        Color.green = new Color(0, 1, 0);
        Color.cyan = new Color(0, 1, 1);
        Color.red = new Color(1, 0, 0);
        Color.magenta = new Color(1, 0, 1);
        Color.yellow = new Color(1, 1, 0);
        Color.white = new Color(1, 1, 1);
        return Color;
      })(VectorN_1.default);
      exports_1("default", Color);
    }
  };
});

System.register("davinci-eight/facets/ColorFacet.js", ["../core/Color", "../core", "../checks/mustBeNumber", "../core/Shareable", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Color_1,
      core_1,
      mustBeNumber_1,
      Shareable_1,
      GraphicsProgramSymbols_1;
  var COORD_R,
      COORD_G,
      COORD_B,
      ColorFacet;
  function checkPropertyName(name) {
    if (typeof name !== 'string') {
      var msg = "ColorFacet property 'name' must be a string.";
      if (core_1.default.strict) {
        throw new TypeError(msg);
      } else {
        console.warn(msg);
      }
    }
    switch (name) {
      case ColorFacet.PROP_RGB:
        return;
      default:
        {
          var msg = "ColorFacet property 'name' must be one of " + [ColorFacet.PROP_RGB, ColorFacet.PROP_RGBA, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE, ColorFacet.PROP_ALPHA] + ".";
          if (core_1.default.strict) {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }
        }
    }
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      COORD_R = 0;
      COORD_G = 1;
      COORD_B = 2;
      ColorFacet = (function(_super) {
        __extends(ColorFacet, _super);
        function ColorFacet() {
          _super.call(this, 'ColorFacet');
          this.color = Color_1.default.fromRGB(1, 1, 1);
          this.a = 1;
          this.uColorName = GraphicsProgramSymbols_1.default.UNIFORM_COLOR;
          this.uAlphaName = GraphicsProgramSymbols_1.default.UNIFORM_ALPHA;
        }
        ColorFacet.prototype.destructor = function() {
          this.color = void 0;
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ColorFacet.prototype, "r", {
          get: function() {
            return this.color.r;
          },
          set: function(red) {
            mustBeNumber_1.default('red', red);
            this.color.r = red;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
          get: function() {
            return this.color.g;
          },
          set: function(green) {
            mustBeNumber_1.default('green', green);
            this.color.g = green;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
          get: function() {
            return this.color.b;
          },
          set: function(blue) {
            mustBeNumber_1.default('blue', blue);
            this.color.b = blue;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "α", {
          get: function() {
            return this.a;
          },
          set: function(α) {
            this.a = α;
          },
          enumerable: true,
          configurable: true
        });
        ColorFacet.prototype.scaleRGB = function(α) {
          this.r *= α;
          this.g *= α;
          this.b *= α;
          return this;
        };
        ColorFacet.prototype.scaleRGBA = function(α) {
          this.r *= α;
          this.g *= α;
          this.b *= α;
          this.α *= α;
          return this;
        };
        ColorFacet.prototype.setRGB = function(red, green, blue) {
          this.r = red;
          this.g = green;
          this.b = blue;
          return this;
        };
        ColorFacet.prototype.setRGBA = function(red, green, blue, α) {
          this.r = red;
          this.g = green;
          this.b = blue;
          this.α = α;
          return this;
        };
        ColorFacet.prototype.getProperty = function(name) {
          checkPropertyName(name);
          switch (name) {
            case ColorFacet.PROP_RGB:
              {
                return [this.r, this.g, this.b];
              }
              break;
            case ColorFacet.PROP_RED:
              {
                return [this.r];
              }
              break;
            case ColorFacet.PROP_GREEN:
              {
                return [this.g];
              }
              break;
            default:
              {
                return void 0;
              }
          }
        };
        ColorFacet.prototype.setProperty = function(name, data) {
          checkPropertyName(name);
          switch (name) {
            case ColorFacet.PROP_RGB:
              {
                this.r = data[COORD_R];
                this.g = data[COORD_G];
                this.b = data[COORD_B];
              }
              break;
            case ColorFacet.PROP_RED:
              {
                this.r = data[COORD_R];
              }
              break;
            default:
              {}
          }
          return this;
        };
        ColorFacet.prototype.setUniforms = function(visitor) {
          if (this.uColorName) {
            visitor.vector3(this.uColorName, this.color.coords);
          }
          if (this.uAlphaName) {
            visitor.uniform1f(this.uAlphaName, this.a);
          }
        };
        ColorFacet.PROP_RGB = 'rgb';
        ColorFacet.PROP_RGBA = 'rgba';
        ColorFacet.PROP_RED = 'r';
        ColorFacet.PROP_GREEN = 'g';
        ColorFacet.PROP_BLUE = 'b';
        ColorFacet.PROP_ALPHA = 'a';
        return ColorFacet;
      })(Shareable_1.default);
      exports_1("default", ColorFacet);
    }
  };
});

System.register("davinci-eight/utils/EventEmitter.js", [], function(exports_1) {
  var EventEmitter;
  return {
    setters: [],
    execute: function() {
      EventEmitter = (function() {
        function EventEmitter(owner) {
          this.owner = owner;
        }
        EventEmitter.prototype.addEventListener = function(eventName, callback) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
          }
          if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
          }
          return callback;
        };
        EventEmitter.prototype.removeEventListener = function(eventName, callback) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners)
            return;
          var index = listeners.indexOf(callback);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        };
        EventEmitter.prototype.emit = function(eventName, key, value) {
          if (this._eventRegistry) {
            var listeners = this._eventRegistry[eventName];
            if (listeners) {
              var iLength = listeners.length;
              if (iLength) {
                for (var i = 0; i < iLength; i++) {
                  listeners[i](eventName, key, value, this.owner);
                }
              }
            }
          }
        };
        return EventEmitter;
      })();
      exports_1("default", EventEmitter);
    }
  };
});

System.register("davinci-eight/math/G3.js", ["../math/dotVectorE3", "../math/Euclidean3", "../utils/EventEmitter", "../math/extG3", "../math/lcoG3", "../math/mulG3", "../checks/mustBeInteger", "../checks/mustBeString", "../math/quadVectorE3", "../math/rcoG3", "../i18n/readOnly", "../math/rotorFromDirections", "../math/scpG3", "../math/squaredNormG3", "../math/stringFromCoordinates", "../math/VectorN", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorE3_1,
      Euclidean3_1,
      EventEmitter_1,
      extG3_1,
      lcoG3_1,
      mulG3_1,
      mustBeInteger_1,
      mustBeString_1,
      quadVectorE3_1,
      rcoG3_1,
      readOnly_1,
      rotorFromDirections_1,
      scpG3_1,
      squaredNormG3_1,
      stringFromCoordinates_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_XYZ,
      EVENT_NAME_CHANGE,
      atan2,
      exp,
      cos,
      log,
      sin,
      sqrt,
      BASIS_LABELS,
      zero,
      one,
      e1,
      e2,
      e3,
      I,
      G3;
  function coordinates(m) {
    return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
  }
  function makeConstantE3(label, α, x, y, z, yz, zx, xy, β) {
    mustBeString_1.default('label', label);
    var that;
    that = {
      get α() {
        return α;
      },
      set α(unused) {
        throw new Error(readOnly_1.default(label + '.α').message);
      },
      get x() {
        return x;
      },
      set x(unused) {
        throw new Error(readOnly_1.default(label + '.x').message);
      },
      get y() {
        return y;
      },
      set y(unused) {
        throw new Error(readOnly_1.default(label + '.y').message);
      },
      get z() {
        return z;
      },
      set z(unused) {
        throw new Error(readOnly_1.default(label + '.x').message);
      },
      get yz() {
        return yz;
      },
      set yz(unused) {
        throw new Error(readOnly_1.default(label + '.yz').message);
      },
      get zx() {
        return zx;
      },
      set zx(unused) {
        throw new Error(readOnly_1.default(label + '.zx').message);
      },
      get xy() {
        return xy;
      },
      set xy(unused) {
        throw new Error(readOnly_1.default(label + '.xy').message);
      },
      get β() {
        return β;
      },
      set β(unused) {
        throw new Error(readOnly_1.default(label + '.β').message);
      },
      toString: function() {
        return label;
      }
    };
    return that;
  }
  return {
    setters: [function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(EventEmitter_1_1) {
      EventEmitter_1 = EventEmitter_1_1;
    }, function(extG3_1_1) {
      extG3_1 = extG3_1_1;
    }, function(lcoG3_1_1) {
      lcoG3_1 = lcoG3_1_1;
    }, function(mulG3_1_1) {
      mulG3_1 = mulG3_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(quadVectorE3_1_1) {
      quadVectorE3_1 = quadVectorE3_1_1;
    }, function(rcoG3_1_1) {
      rcoG3_1 = rcoG3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(scpG3_1_1) {
      scpG3_1 = scpG3_1_1;
    }, function(squaredNormG3_1_1) {
      squaredNormG3_1 = squaredNormG3_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_XYZ = 7;
      EVENT_NAME_CHANGE = 'change';
      atan2 = Math.atan2;
      exp = Math.exp;
      cos = Math.cos;
      log = Math.log;
      sin = Math.sin;
      sqrt = Math.sqrt;
      BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
      zero = makeConstantE3('0', 0, 0, 0, 0, 0, 0, 0, 0);
      one = makeConstantE3('1', 1, 0, 0, 0, 0, 0, 0, 0);
      e1 = makeConstantE3('e1', 0, 1, 0, 0, 0, 0, 0, 0);
      e2 = makeConstantE3('e2', 0, 0, 1, 0, 0, 0, 0, 0);
      e3 = makeConstantE3('e2', 0, 0, 0, 1, 0, 0, 0, 0);
      I = makeConstantE3('I', 0, 0, 0, 0, 0, 0, 0, 1);
      G3 = (function(_super) {
        __extends(G3, _super);
        function G3() {
          _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
          this.eventBus = new EventEmitter_1.default(this);
        }
        G3.prototype.on = function(eventName, callback) {
          this.eventBus.addEventListener(eventName, callback);
        };
        G3.prototype.off = function(eventName, callback) {
          this.eventBus.removeEventListener(eventName, callback);
        };
        G3.prototype.setCoordinate = function(index, newValue, name) {
          var coords = this.coords;
          var previous = coords[index];
          if (newValue !== previous) {
            coords[index] = newValue;
            this.modified = true;
            this.eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
          }
        };
        Object.defineProperty(G3.prototype, "α", {
          get: function() {
            return this.coords[COORD_W];
          },
          set: function(α) {
            this.setCoordinate(COORD_W, α, 'α');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(x) {
            this.setCoordinate(COORD_X, x, 'x');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(y) {
            this.setCoordinate(COORD_Y, y, 'y');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
          get: function() {
            return this.coords[COORD_Z];
          },
          set: function(z) {
            this.setCoordinate(COORD_Z, z, 'z');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
          get: function() {
            return this.coords[COORD_YZ];
          },
          set: function(yz) {
            this.setCoordinate(COORD_YZ, yz, 'yz');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
          get: function() {
            return this.coords[COORD_ZX];
          },
          set: function(zx) {
            this.setCoordinate(COORD_ZX, zx, 'zx');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            this.setCoordinate(COORD_XY, xy, 'xy');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
          get: function() {
            return this.coords[COORD_XYZ];
          },
          set: function(β) {
            this.setCoordinate(COORD_XYZ, β, 'β');
          },
          enumerable: true,
          configurable: true
        });
        G3.prototype.add = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          this.α += M.α * α;
          this.x += M.x * α;
          this.y += M.y * α;
          this.z += M.z * α;
          this.yz += M.yz * α;
          this.zx += M.zx * α;
          this.xy += M.xy * α;
          this.β += M.β * α;
          return this;
        };
        G3.prototype.addPseudo = function(β) {
          this.β += β;
          return this;
        };
        G3.prototype.addScalar = function(α) {
          this.α += α;
          return this;
        };
        G3.prototype.addVector = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += v.x * α;
          this.y += v.y * α;
          this.z += v.z * α;
          return this;
        };
        G3.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          this.yz = a.yz + b.yz;
          this.zx = a.zx + b.zx;
          this.xy = a.xy + b.xy;
          this.β = a.β + b.β;
          return this;
        };
        G3.prototype.adj = function() {
          throw new Error('TODO: G3.adj');
        };
        G3.prototype.angle = function() {
          return this.log().grade(2);
        };
        G3.prototype.clone = function() {
          return G3.copy(this);
        };
        G3.prototype.conj = function() {
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        G3.prototype.lco = function(m) {
          return this.lco2(this, m);
        };
        G3.prototype.lco2 = function(a, b) {
          return lcoG3_1.default(a, b, this);
        };
        G3.prototype.rco = function(m) {
          return this.rco2(this, m);
        };
        G3.prototype.rco2 = function(a, b) {
          return rcoG3_1.default(a, b, this);
        };
        G3.prototype.copy = function(M) {
          this.α = M.α;
          this.x = M.x;
          this.y = M.y;
          this.z = M.z;
          this.yz = M.yz;
          this.zx = M.zx;
          this.xy = M.xy;
          this.β = M.β;
          return this;
        };
        G3.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        G3.prototype.copySpinor = function(spinor) {
          this.zero();
          this.α = spinor.α;
          this.yz = spinor.yz;
          this.zx = spinor.zx;
          this.xy = spinor.xy;
          return this;
        };
        G3.prototype.copyVector = function(vector) {
          this.zero();
          this.x = vector.x;
          this.y = vector.y;
          this.z = vector.z;
          return this;
        };
        G3.prototype.div = function(m) {
          return this.div2(this, m);
        };
        G3.prototype.divByScalar = function(α) {
          this.α /= α;
          this.x /= α;
          this.y /= α;
          this.z /= α;
          this.yz /= α;
          this.zx /= α;
          this.xy /= α;
          this.β /= α;
          return this;
        };
        G3.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        G3.prototype.dual = function(m) {
          var w = -m.β;
          var x = -m.yz;
          var y = -m.zx;
          var z = -m.xy;
          var yz = m.x;
          var zx = m.y;
          var xy = m.z;
          var β = m.α;
          this.α = w;
          this.x = x;
          this.y = y;
          this.z = z;
          this.yz = yz;
          this.zx = zx;
          this.xy = xy;
          this.β = β;
          return this;
        };
        G3.prototype.exp = function() {
          var expW = exp(this.α);
          var yz = this.yz;
          var zx = this.zx;
          var xy = this.xy;
          var φ = sqrt(yz * yz + zx * zx + xy * xy);
          var s = φ !== 0 ? sin(φ) / φ : 1;
          var cosφ = cos(φ);
          this.α = cosφ;
          this.yz = yz * s;
          this.zx = zx * s;
          this.xy = xy * s;
          return this.scale(expW);
        };
        G3.prototype.inv = function() {
          this.conj();
          return this;
        };
        G3.prototype.isOne = function() {
          return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3.prototype.isZero = function() {
          return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3.prototype.lerp = function(target, α) {
          this.α += (target.α - this.α) * α;
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          this.yz += (target.yz - this.yz) * α;
          this.zx += (target.zx - this.zx) * α;
          this.xy += (target.xy - this.xy) * α;
          this.β += (target.β - this.β) * α;
          return this;
        };
        G3.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        G3.prototype.log = function() {
          var α = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var BB = x * x + y * y + z * z;
          var B = sqrt(BB);
          var f = atan2(B, α) / B;
          this.α = log(sqrt(α * α + BB));
          this.yz = x * f;
          this.zx = y * f;
          this.xy = z * f;
          return this;
        };
        G3.prototype.magnitude = function() {
          return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.mul = function(m) {
          return this.mul2(this, m);
        };
        G3.prototype.mul2 = function(a, b) {
          return mulG3_1.default(a, b, this);
        };
        G3.prototype.neg = function() {
          this.α = -this.α;
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          this.β = -this.β;
          return this;
        };
        G3.prototype.norm = function() {
          this.α = this.magnitudeSansUnits();
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        G3.prototype.direction = function() {
          var norm = this.magnitudeSansUnits();
          this.α = this.α / norm;
          this.x = this.x / norm;
          this.y = this.y / norm;
          this.z = this.z / norm;
          this.yz = this.yz / norm;
          this.zx = this.zx / norm;
          this.xy = this.xy / norm;
          this.β = this.β / norm;
          return this;
        };
        G3.prototype.one = function() {
          this.α = 1;
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          this.β = 0;
          return this;
        };
        G3.prototype.quad = function() {
          return this.squaredNorm();
        };
        G3.prototype.squaredNorm = function() {
          this.α = this.squaredNormSansUnits();
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        G3.prototype.squaredNormSansUnits = function() {
          return squaredNormG3_1.default(this);
        };
        G3.prototype.reflect = function(n) {
          var N = Euclidean3_1.default.fromVectorE3(n);
          var M = Euclidean3_1.default.copy(this);
          var R = N.mul(M).mul(N).scale(-1);
          this.copy(R);
          return this;
        };
        G3.prototype.rev = function() {
          this.α = +this.α;
          this.x = +this.x;
          this.y = +this.y;
          this.z = +this.z;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          this.β = -this.β;
          return this;
        };
        G3.prototype.__tilde__ = function() {
          return G3.copy(this).rev();
        };
        G3.prototype.rotate = function(R) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var a = R.xy;
          var b = R.yz;
          var c = R.zx;
          var α = R.α;
          var ix = α * x - c * z + a * y;
          var iy = α * y - a * x + b * z;
          var iz = α * z - b * y + c * x;
          var iα = b * x + c * y + a * z;
          this.x = ix * α + iα * b + iy * a - iz * c;
          this.y = iy * α + iα * c + iz * b - ix * a;
          this.z = iz * α + iα * a + ix * c - iy * b;
          return this;
        };
        G3.prototype.rotorFromDirections = function(b, a) {
          return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        G3.prototype.rotorFromAxisAngle = function(axis, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -axis.x * s;
          this.zx = -axis.y * s;
          this.xy = -axis.z * s;
          this.α = cos(φ);
          return this;
        };
        G3.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -B.yz * s;
          this.zx = -B.zx * s;
          this.xy = -B.xy * s;
          this.α = cos(φ);
          return this;
        };
        G3.prototype.scp = function(m) {
          return this.scp2(this, m);
        };
        G3.prototype.scp2 = function(a, b) {
          return scpG3_1.default(a, b, this);
        };
        G3.prototype.scale = function(α) {
          this.α *= α;
          this.x *= α;
          this.y *= α;
          this.z *= α;
          this.yz *= α;
          this.zx *= α;
          this.xy *= α;
          this.β *= α;
          return this;
        };
        G3.prototype.slerp = function(target, α) {
          return this;
        };
        G3.prototype.spinor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var az = a.z;
          var bx = b.x;
          var by = b.y;
          var bz = b.z;
          this.zero();
          this.α = dotVectorE3_1.default(a, b);
          this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        G3.prototype.sub = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          this.α -= M.α * α;
          this.x -= M.x * α;
          this.y -= M.y * α;
          this.z -= M.z * α;
          this.yz -= M.yz * α;
          this.zx -= M.zx * α;
          this.xy -= M.xy * α;
          this.β -= M.β * α;
          return this;
        };
        G3.prototype.sub2 = function(a, b) {
          this.α = a.α - b.α;
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          this.yz = a.yz - b.yz;
          this.zx = a.zx - b.zx;
          this.xy = a.xy - b.xy;
          this.β = a.β - b.β;
          return this;
        };
        G3.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.toFixed = function(fractionDigits) {
          var coordToString = function(coord) {
            return coord.toFixed(fractionDigits);
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
              break;
            case 1:
              {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.β = 0;
              }
              break;
            case 3:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
          }
          return this;
        };
        G3.prototype.ext = function(m) {
          return this.ext2(this, m);
        };
        G3.prototype.ext2 = function(a, b) {
          return extG3_1.default(a, b, this);
        };
        G3.prototype.zero = function() {
          this.α = 0;
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          this.β = 0;
          return this;
        };
        G3.prototype.__add__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).add(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).add(G3.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3.prototype.__div__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).div(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).divByScalar(rhs);
          } else {
            return void 0;
          }
        };
        G3.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).div(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).div(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__mul__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).mul(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G3.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).mul(this);
          } else if (typeof lhs === 'number') {
            return G3.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G3.prototype.__radd__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).add(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).add(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).sub(rhs);
          } else if (typeof rhs === 'number') {
            return G3.fromScalar(rhs).neg().add(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).sub(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).sub(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).ext(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G3.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).ext(this);
          } else if (typeof lhs === 'number') {
            return G3.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G3.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).lco(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).lco(G3.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).lco(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).lco(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).rco(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).rco(G3.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).rco(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).rco(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof G3) {
            return G3.copy(this).scp(rhs);
          } else if (typeof rhs === 'number') {
            return G3.copy(this).scp(G3.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof G3) {
            return G3.copy(lhs).scp(this);
          } else if (typeof lhs === 'number') {
            return G3.fromScalar(lhs).scp(this);
          } else {
            return void 0;
          }
        };
        G3.prototype.__bang__ = function() {
          return G3.copy(this).inv();
        };
        G3.prototype.__pos__ = function() {
          return G3.copy(this);
        };
        G3.prototype.__neg__ = function() {
          return G3.copy(this).neg();
        };
        Object.defineProperty(G3, "zero", {
          get: function() {
            return G3.copy(zero);
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "one", {
          get: function() {
            return G3.copy(one);
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "e1", {
          get: function() {
            return G3.copy(e1);
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "e2", {
          get: function() {
            return G3.copy(e2);
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "e3", {
          get: function() {
            return G3.copy(e3);
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "I", {
          get: function() {
            return G3.copy(I);
          },
          enumerable: true,
          configurable: true
        });
        ;
        G3.copy = function(M) {
          var copy = new G3();
          copy.α = M.α;
          copy.x = M.x;
          copy.y = M.y;
          copy.z = M.z;
          copy.yz = M.yz;
          copy.zx = M.zx;
          copy.xy = M.xy;
          copy.β = M.β;
          return copy;
        };
        G3.fromScalar = function(α) {
          return new G3().copyScalar(α);
        };
        G3.fromSpinor = function(spinor) {
          var copy = new G3();
          copy.α = spinor.α;
          copy.yz = spinor.yz;
          copy.zx = spinor.yz;
          copy.xy = spinor.xy;
          return copy;
        };
        G3.fromVector = function(vector) {
          var copy = new G3();
          copy.x = vector.x;
          copy.y = vector.y;
          copy.z = vector.z;
          return copy;
        };
        G3.lerp = function(A, B, α) {
          return G3.copy(A).lerp(B, α);
        };
        G3.rotorFromDirections = function(a, b) {
          return new G3().rotorFromDirections(a, b);
        };
        return G3;
      })(VectorN_1.default);
      exports_1("default", G3);
    }
  };
});

System.register("davinci-eight/checks/isObject.js", [], function(exports_1) {
  function isObject(x) {
    return (typeof x === 'object');
  }
  exports_1("default", isObject);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeObject.js", ["../checks/mustSatisfy", "../checks/isObject"], function(exports_1) {
  var mustSatisfy_1,
      isObject_1;
  function beObject() {
    return "be an `object`";
  }
  function mustBeObject(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
    return value;
  }
  exports_1("default", mustBeObject);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isObject_1_1) {
      isObject_1 = isObject_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/quadSpinorE3.js", ["../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var isDefined_1,
      isNumber_1;
  function quadSpinorE3(s) {
    if (isDefined_1.default(s)) {
      var α = s.α;
      var x = s.yz;
      var y = s.zx;
      var z = s.xy;
      if (isNumber_1.default(α) && isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
        return α * α + x * x + y * y + z * z;
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadSpinorE3);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/quadVectorE3.js", ["../math/dotVectorCartesianE3", "../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var dotVectorCartesianE3_1,
      isDefined_1,
      isNumber_1;
  function quadVectorE3(vector) {
    if (isDefined_1.default(vector)) {
      var x = vector.x;
      var y = vector.y;
      var z = vector.z;
      if (isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
        return dotVectorCartesianE3_1.default(x, y, z, x, y, z);
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadVectorE3);
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rotorFromDirections.js", [], function(exports_1) {
  var sqrt;
  function rotorFromDirections(a, b, quad, dot, m) {
    var quadA = quad(a);
    var absA = sqrt(quadA);
    var quadB = quad(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)));
    if (denom !== 0) {
      m = m.spinor(b, a);
      m = m.addScalar(BA);
      m = m.divByScalar(denom);
      return m;
    } else {
      return void 0;
    }
  }
  exports_1("default", rotorFromDirections);
  return {
    setters: [],
    execute: function() {
      sqrt = Math.sqrt;
    }
  };
});

System.register("davinci-eight/math/SpinG3.js", ["../math/dotVectorCartesianE3", "../math/dotVectorE3", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadSpinorE3", "../math/quadVectorE3", "../math/rotorFromDirections", "../math/VectorN", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorCartesianE3_1,
      dotVectorE3_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadSpinorE3_1,
      quadVectorE3_1,
      rotorFromDirections_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var COORD_YZ,
      COORD_ZX,
      COORD_XY,
      COORD_SCALAR,
      exp,
      cos,
      sin,
      sqrt,
      SpinG3;
  function one() {
    var coords = [0, 0, 0, 0];
    coords[COORD_SCALAR] = 1;
    return coords;
  }
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadSpinorE3_1_1) {
      quadSpinorE3_1 = quadSpinorE3_1_1;
    }, function(quadVectorE3_1_1) {
      quadVectorE3_1 = quadVectorE3_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      COORD_YZ = 0;
      COORD_ZX = 1;
      COORD_XY = 2;
      COORD_SCALAR = 3;
      exp = Math.exp;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      SpinG3 = (function(_super) {
        __extends(SpinG3, _super);
        function SpinG3(coordinates, modified) {
          if (coordinates === void 0) {
            coordinates = one();
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, coordinates, modified, 4);
        }
        Object.defineProperty(SpinG3.prototype, "yz", {
          get: function() {
            return this.coords[COORD_YZ];
          },
          set: function(yz) {
            mustBeNumber_1.default('yz', yz);
            this.modified = this.modified || this.yz !== yz;
            this.coords[COORD_YZ] = yz;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "zx", {
          get: function() {
            return this.coords[COORD_ZX];
          },
          set: function(zx) {
            mustBeNumber_1.default('zx', zx);
            this.modified = this.modified || this.zx !== zx;
            this.coords[COORD_ZX] = zx;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            mustBeNumber_1.default('xy', xy);
            this.modified = this.modified || this.xy !== xy;
            this.coords[COORD_XY] = xy;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SpinG3.prototype, "α", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(α) {
            mustBeNumber_1.default('α', α);
            this.modified = this.modified || this.α !== α;
            this.coords[COORD_SCALAR] = α;
          },
          enumerable: true,
          configurable: true
        });
        SpinG3.prototype.add = function(spinor, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('spinor', spinor);
          mustBeNumber_1.default('α', α);
          this.yz += spinor.yz * α;
          this.zx += spinor.zx * α;
          this.xy += spinor.xy * α;
          this.α += spinor.α * α;
          return this;
        };
        SpinG3.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.yz = a.yz + b.yz;
          this.zx = a.zx + b.zx;
          this.xy = a.xy + b.xy;
          return this;
        };
        SpinG3.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          return this;
        };
        SpinG3.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        SpinG3.prototype.adj = function() {
          throw new Error('TODO: SpinG3.adj');
        };
        SpinG3.prototype.angle = function() {
          return this.log().grade(2);
        };
        SpinG3.prototype.clone = function() {
          return SpinG3.copy(this);
        };
        SpinG3.prototype.conj = function() {
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        SpinG3.prototype.copy = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.yz = mustBeNumber_1.default('spinor.yz', spinor.yz);
          this.zx = mustBeNumber_1.default('spinor.zx', spinor.zx);
          this.xy = mustBeNumber_1.default('spinor.xy', spinor.xy);
          this.α = mustBeNumber_1.default('spinor.α', spinor.α);
          return this;
        };
        SpinG3.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        SpinG3.prototype.copySpinor = function(s) {
          return this.copy(s);
        };
        SpinG3.prototype.copyVector = function(vector) {
          return this.zero();
        };
        SpinG3.prototype.div = function(s) {
          return this.div2(this, s);
        };
        SpinG3.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        SpinG3.prototype.divByScalar = function(α) {
          this.yz /= α;
          this.zx /= α;
          this.xy /= α;
          this.α /= α;
          return this;
        };
        SpinG3.prototype.dual = function(v) {
          mustBeObject_1.default('v', v);
          this.α = 0;
          this.yz = mustBeNumber_1.default('v.x', v.x);
          this.zx = mustBeNumber_1.default('v.y', v.y);
          this.xy = mustBeNumber_1.default('v.z', v.z);
          return this;
        };
        SpinG3.prototype.exp = function() {
          var w = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var expW = exp(w);
          var φ = sqrt(x * x + y * y + z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.yz = x * s;
          this.zx = y * s;
          this.xy = z * s;
          return this;
        };
        SpinG3.prototype.inv = function() {
          this.conj();
          this.divByScalar(this.squaredNormSansUnits());
          return this;
        };
        SpinG3.prototype.lco = function(rhs) {
          return this.lco2(this, rhs);
        };
        SpinG3.prototype.lco2 = function(a, b) {
          return this;
        };
        SpinG3.prototype.lerp = function(target, α) {
          var R2 = SpinG3.copy(target);
          var R1 = this.clone();
          var R = R2.mul(R1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        SpinG3.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        SpinG3.prototype.log = function() {
          var w = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var bb = x * x + y * y + z * z;
          var R2 = sqrt(bb);
          var R0 = Math.abs(w);
          var R = sqrt(w * w + bb);
          this.α = Math.log(R);
          var θ = Math.atan2(R2, R0) / R2;
          this.yz = x * θ;
          this.zx = y * θ;
          this.xy = z * θ;
          return this;
        };
        SpinG3.prototype.magnitude = function() {
          return this.norm();
        };
        SpinG3.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        SpinG3.prototype.mul = function(s) {
          return this.mul2(this, s);
        };
        SpinG3.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        SpinG3.prototype.neg = function() {
          this.α = -this.α;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        SpinG3.prototype.norm = function() {
          var norm = this.magnitudeSansUnits();
          return this.zero().addScalar(norm);
        };
        SpinG3.prototype.direction = function() {
          var modulus = this.magnitudeSansUnits();
          this.yz = this.yz / modulus;
          this.zx = this.zx / modulus;
          this.xy = this.xy / modulus;
          this.α = this.α / modulus;
          return this;
        };
        SpinG3.prototype.one = function() {
          this.α = 1;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        SpinG3.prototype.quad = function() {
          return this.squaredNorm();
        };
        SpinG3.prototype.squaredNorm = function() {
          var squaredNorm = this.squaredNormSansUnits();
          return this.zero().addScalar(squaredNorm);
        };
        SpinG3.prototype.squaredNormSansUnits = function() {
          return quadSpinorE3_1.default(this);
        };
        SpinG3.prototype.rco = function(rhs) {
          return this.rco2(this, rhs);
        };
        SpinG3.prototype.rco2 = function(a, b) {
          return this;
        };
        SpinG3.prototype.rev = function() {
          this.yz *= -1;
          this.zx *= -1;
          this.xy *= -1;
          return this;
        };
        SpinG3.prototype.reflect = function(n) {
          var w = this.α;
          var yz = this.yz;
          var zx = this.zx;
          var xy = this.xy;
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var nn = nx * nx + ny * ny + nz * nz;
          var nB = nx * yz + ny * zx + nz * xy;
          this.α = nn * w;
          this.xy = 2 * nz * nB - nn * xy;
          this.yz = 2 * nx * nB - nn * yz;
          this.zx = 2 * ny * nB - nn * zx;
          return this;
        };
        SpinG3.prototype.rotate = function(rotor) {
          console.warn("SpinG3.rotate is not implemented");
          return this;
        };
        SpinG3.prototype.rotorFromDirections = function(a, b) {
          return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        SpinG3.prototype.rotorFromAxisAngle = function(axis, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -axis.x * s;
          this.zx = -axis.y * s;
          this.xy = -axis.z * s;
          this.α = cos(φ);
          return this;
        };
        SpinG3.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -B.yz * s;
          this.zx = -B.zx * s;
          this.xy = -B.xy * s;
          this.α = cos(φ);
          return this;
        };
        SpinG3.prototype.scp = function(rhs) {
          return this.scp2(this, rhs);
        };
        SpinG3.prototype.scp2 = function(a, b) {
          return this;
        };
        SpinG3.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.yz *= α;
          this.zx *= α;
          this.xy *= α;
          this.α *= α;
          return this;
        };
        SpinG3.prototype.slerp = function(target, α) {
          var R2 = SpinG3.copy(target);
          var R1 = this.clone();
          var R = R2.mul(R1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        SpinG3.prototype.sub = function(s, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('s', s);
          mustBeNumber_1.default('α', α);
          this.yz -= s.yz * α;
          this.zx -= s.zx * α;
          this.xy -= s.xy * α;
          this.α -= s.α * α;
          return this;
        };
        SpinG3.prototype.sub2 = function(a, b) {
          this.yz = a.yz - b.yz;
          this.zx = a.zx - b.zx;
          this.xy = a.xy - b.xy;
          this.α = a.α - b.α;
          return this;
        };
        SpinG3.prototype.spinor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var az = a.z;
          var bx = b.x;
          var by = b.y;
          var bz = b.z;
          this.α = dotVectorCartesianE3_1.default(ax, ay, az, bx, by, bz);
          this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        SpinG3.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
          }
          return this;
        };
        SpinG3.prototype.toExponential = function() {
          return this.toString();
        };
        SpinG3.prototype.toFixed = function(digits) {
          return this.toString();
        };
        SpinG3.prototype.toString = function() {
          return "SpinG3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})";
        };
        SpinG3.prototype.ext = function(rhs) {
          return this.ext2(this, rhs);
        };
        SpinG3.prototype.ext2 = function(a, b) {
          return this;
        };
        SpinG3.prototype.zero = function() {
          this.α = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        SpinG3.copy = function(spinor) {
          return new SpinG3().copy(spinor);
        };
        SpinG3.dual = function(v) {
          return new SpinG3().dual(v);
        };
        SpinG3.lerp = function(a, b, α) {
          return SpinG3.copy(a).lerp(b, α);
        };
        SpinG3.rotorFromDirections = function(a, b) {
          return new SpinG3().rotorFromDirections(a, b);
        };
        return SpinG3;
      })(VectorN_1.default);
      exports_1("default", SpinG3);
    }
  };
});

System.register("davinci-eight/core/refChange.js", [], function(exports_1) {
  var statistics,
      skip,
      trace,
      traceName,
      LOGGING_NAME_REF_CHANGE;
  function prefix(message) {
    return LOGGING_NAME_REF_CHANGE + ": " + message;
  }
  function log(message) {
    return console.log(prefix(message));
  }
  function warn(message) {
    return console.warn(prefix(message));
  }
  function error(message) {
    return console.error(prefix(message));
  }
  function garbageCollect() {
    var uuids = Object.keys(statistics);
    uuids.forEach(function(uuid) {
      var element = statistics[uuid];
      if (element.refCount === 0) {
        delete statistics[uuid];
      }
    });
  }
  function computeOutstanding() {
    var uuids = Object.keys(statistics);
    var uuidsLength = uuids.length;
    var i;
    var total = 0;
    for (i = 0; i < uuidsLength; i++) {
      var uuid = uuids[i];
      var statistic = statistics[uuid];
      total += statistic.refCount;
    }
    return total;
  }
  function stop() {
    if (skip) {
      warn("Nothing to see because skip mode is " + skip);
    }
    garbageCollect();
    return computeOutstanding();
  }
  function dump() {
    var outstanding = stop();
    if (outstanding > 0) {
      warn(JSON.stringify(statistics, null, 2));
    } else {
      log("There are " + outstanding + " outstanding reference counts.");
    }
    return outstanding;
  }
  function refChange(uuid, name, change) {
    if (change === void 0) {
      change = 0;
    }
    if (change !== 0 && skip) {
      return;
    }
    if (trace) {
      if (traceName) {
        if (name === traceName) {
          var element = statistics[uuid];
          if (element) {
            log(change + " on " + uuid + " @ " + name);
          } else {
            log(change + " on " + uuid + " @ " + name);
          }
        }
      } else {
        log(change + " on " + uuid + " @ " + name);
      }
    }
    if (change === +1) {
      var element = statistics[uuid];
      if (!element) {
        element = {
          refCount: 0,
          name: name,
          zombie: false
        };
        statistics[uuid] = element;
      }
      element.refCount += change;
    } else if (change === -1) {
      var element = statistics[uuid];
      if (element) {
        element.refCount += change;
        if (element.refCount === 0) {
          element.zombie = true;
        } else if (element.refCount < 0) {
          error("refCount < 0 for " + name);
        }
      } else {
        error(change + " on " + uuid + " @ " + name);
      }
    } else if (change === 0) {
      var message = "" + uuid + " @ " + name;
      log(message);
      if (uuid === 'stop') {
        return stop();
      }
      if (uuid === 'dump') {
        return dump();
      } else if (uuid === 'start') {
        skip = false;
        trace = false;
      } else if (uuid === 'reset') {
        statistics = {};
        skip = true;
        trace = false;
        traceName = void 0;
      } else if (uuid === 'trace') {
        skip = false;
        trace = true;
        traceName = name;
      } else {
        throw new Error(prefix("Unexpected command " + message));
      }
    } else {
      throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
    }
  }
  exports_1("default", refChange);
  return {
    setters: [],
    execute: function() {
      statistics = {};
      skip = true;
      trace = false;
      traceName = void 0;
      LOGGING_NAME_REF_CHANGE = 'refChange';
    }
  };
});

System.register("davinci-eight/core/uuid4.js", [], function(exports_1) {
  function uuid4() {
    var maxFromBits = function(bits) {
      return Math.pow(2, bits);
    };
    var limitUI04 = maxFromBits(4);
    var limitUI06 = maxFromBits(6);
    var limitUI08 = maxFromBits(8);
    var limitUI12 = maxFromBits(12);
    var limitUI14 = maxFromBits(14);
    var limitUI16 = maxFromBits(16);
    var limitUI32 = maxFromBits(32);
    var limitUI40 = maxFromBits(40);
    var limitUI48 = maxFromBits(48);
    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var randomUI06 = function() {
      return getRandomInt(0, limitUI06 - 1);
    };
    var randomUI08 = function() {
      return getRandomInt(0, limitUI08 - 1);
    };
    var randomUI12 = function() {
      return getRandomInt(0, limitUI12 - 1);
    };
    var randomUI16 = function() {
      return getRandomInt(0, limitUI16 - 1);
    };
    var randomUI32 = function() {
      return getRandomInt(0, limitUI32 - 1);
    };
    var randomUI48 = function() {
      return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
    };
    var paddedString = function(str, length, z) {
      str = String(str);
      z = (!z) ? '0' : z;
      var i = length - str.length;
      for (; i > 0; i >>>= 1, z += z) {
        if (i & 1) {
          str = z + str;
        }
      }
      return str;
    };
    var fromParts = function(timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
      var hex = paddedString(timeLow.toString(16), 8) + '-' + paddedString(timeMid.toString(16), 4) + '-' + paddedString(timeHiAndVersion.toString(16), 4) + '-' + paddedString(clockSeqHiAndReserved.toString(16), 2) + paddedString(clockSeqLow.toString(16), 2) + '-' + paddedString(node.toString(16), 12);
      return hex;
    };
    return {
      generate: function() {
        return fromParts(randomUI32(), randomUI16(), 0x4000 | randomUI12(), 0x80 | randomUI06(), randomUI08(), randomUI48());
      },
      validate: function(uuid) {
        var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return testPattern.test(uuid);
      }
    };
  }
  exports_1("default", uuid4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/Shareable.js", ["../checks/mustBeString", "../i18n/readOnly", "./refChange", "./uuid4"], function(exports_1) {
  var mustBeString_1,
      readOnly_1,
      refChange_1,
      uuid4_1;
  var Shareable;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(refChange_1_1) {
      refChange_1 = refChange_1_1;
    }, function(uuid4_1_1) {
      uuid4_1 = uuid4_1_1;
    }],
    execute: function() {
      Shareable = (function() {
        function Shareable(type) {
          this._refCount = 1;
          this._uuid = uuid4_1.default().generate();
          this._type = mustBeString_1.default('type', type);
          refChange_1.default(this._uuid, type, +1);
        }
        Shareable.prototype.isZombie = function() {
          return typeof this._refCount === 'undefined';
        };
        Shareable.prototype.addRef = function() {
          this._refCount++;
          refChange_1.default(this._uuid, this._type, +1);
          return this._refCount;
        };
        Shareable.prototype.release = function() {
          this._refCount--;
          refChange_1.default(this._uuid, this._type, -1);
          var refCount = this._refCount;
          if (refCount === 0) {
            this.destructor(true);
            this._refCount = void 0;
          }
          return refCount;
        };
        Shareable.prototype.destructor = function(grumble) {
          if (grumble === void 0) {
            grumble = false;
          }
          if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
          }
        };
        Object.defineProperty(Shareable.prototype, "uuid", {
          get: function() {
            return this._uuid;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uuid').message);
          },
          enumerable: true,
          configurable: true
        });
        return Shareable;
      })();
      exports_1("default", Shareable);
    }
  };
});

System.register("davinci-eight/models/ModelE3.js", ["../checks/mustBeString", "../math/G3", "../math/R3", "../math/SpinG3", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeString_1,
      G3_1,
      R3_1,
      SpinG3_1,
      readOnly_1,
      Shareable_1;
  var ModelE3;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ModelE3 = (function(_super) {
        __extends(ModelE3, _super);
        function ModelE3(type) {
          if (type === void 0) {
            type = 'ModelE3';
          }
          _super.call(this, mustBeString_1.default('type', type));
          this._position = new G3_1.default().zero();
          this._attitude = new G3_1.default().zero().addScalar(1);
          this._posCache = new R3_1.default();
          this._attCache = new SpinG3_1.default();
          this._position.modified = true;
          this._attitude.modified = true;
        }
        ModelE3.prototype.destructor = function() {
          this._position = void 0;
          this._attitude = void 0;
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelE3.prototype, "R", {
          get: function() {
            return this._attitude;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE3.PROP_ATTITUDE).message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
          get: function() {
            return this._position;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE3.PROP_POSITION).message);
          },
          enumerable: true,
          configurable: true
        });
        ModelE3.prototype.getProperty = function(name) {
          switch (name) {
            case ModelE3.PROP_ATTITUDE:
              {
                return this._attCache.copy(this._attitude).coords;
              }
              break;
            case ModelE3.PROP_POSITION:
              {
                return this._posCache.copy(this._position).coords;
              }
              break;
            default:
              {
                console.warn("ModelE3.getProperty " + name);
                return void 0;
              }
          }
        };
        ModelE3.prototype.setProperty = function(name, data) {
          switch (name) {
            case ModelE3.PROP_ATTITUDE:
              {
                this._attCache.coords = data;
                this._attitude.copySpinor(this._attCache);
              }
              break;
            case ModelE3.PROP_POSITION:
              {
                this._posCache.coords = data;
                this._position.copyVector(this._posCache);
              }
              break;
            default:
              {
                console.warn("ModelE3.setProperty " + name);
              }
          }
          return this;
        };
        ModelE3.PROP_ATTITUDE = 'R';
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
      })(Shareable_1.default);
      exports_1("default", ModelE3);
    }
  };
});

System.register("davinci-eight/math/dotVectorCartesianE3.js", [], function(exports_1) {
  function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
  }
  exports_1("default", dotVectorCartesianE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorE3.js", ["../math/dotVectorCartesianE3", "../checks/isDefined"], function(exports_1) {
  var dotVectorCartesianE3_1,
      isDefined_1;
  function dotVectorE3(a, b) {
    if (isDefined_1.default(a) && isDefined_1.default(b)) {
      return dotVectorCartesianE3_1.default(a.x, a.y, a.z, b.x, b.y, b.z);
    } else {
      return void 0;
    }
  }
  exports_1("default", dotVectorE3);
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/addE3.js", [], function(exports_1) {
  function addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 + b0);
        }
        break;
      case 1:
        {
          x = +(a1 + b1);
        }
        break;
      case 2:
        {
          x = +(a2 + b2);
        }
        break;
      case 3:
        {
          x = +(a3 + b3);
        }
        break;
      case 4:
        {
          x = +(a4 + b4);
        }
        break;
      case 5:
        {
          x = +(a5 + b5);
        }
        break;
      case 6:
        {
          x = +(a6 + b6);
        }
        break;
      case 7:
        {
          x = +(a7 + b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", addE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/b2.js", [], function(exports_1) {
  function b2p0(t, p) {
    var k = 1 - t;
    return k * k * p;
  }
  function b2p1(t, p) {
    return 2 * (1 - t) * t * p;
  }
  function b2p2(t, p) {
    return t * t * p;
  }
  function b2(t, begin, control, end) {
    return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
  }
  exports_1("default", b2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/b3.js", [], function(exports_1) {
  function b3p0(t, p) {
    var k = 1 - t;
    return k * k * k * p;
  }
  function b3p1(t, p) {
    var k = 1 - t;
    return 3 * k * k * t * p;
  }
  function b3p2(t, p) {
    var k = 1 - t;
    return 3 * k * t * t * p;
  }
  function b3p3(t, p) {
    return t * t * t * p;
  }
  function b3(t, p0, p1, p2, p3) {
    return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
  }
  exports_1("default", b3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/extE3.js", [], function(exports_1) {
  function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a2 * b0);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a3 * b0);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
        }
        break;
      case 7:
        {
          x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", extE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/extG3.js", ["../math/compG3Get", "../math/extE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      extE3_1,
      compG3Set_1;
  function extG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, extE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", extG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(extE3_1_1) {
      extE3_1 = extE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoE3.js", [], function(exports_1) {
  function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a3 * b7);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a1 * b7);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 + a2 * b7);
        }
        break;
      case 7:
        {
          x = +(a0 * b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", lcoE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoG3.js", ["../math/compG3Get", "../math/lcoE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      lcoE3_1,
      compG3Set_1;
  function lcoG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, lcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", lcoG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(lcoE3_1_1) {
      lcoE3_1 = lcoE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mulG3.js", ["../math/compG3Get", "../math/mulE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      mulE3_1,
      compG3Set_1;
  function mulG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", mulG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(mulE3_1_1) {
      mulE3_1 = mulE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/NotImplementedError.js", [], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var NotImplementedError;
  return {
    setters: [],
    execute: function() {
      NotImplementedError = (function(_super) {
        __extends(NotImplementedError, _super);
        function NotImplementedError(message) {
          _super.call(this, message);
          this.name = 'NotImplementedError';
        }
        return NotImplementedError;
      })(Error);
      exports_1("default", NotImplementedError);
    }
  };
});

System.register("davinci-eight/math/rcoE3.js", [], function(exports_1) {
  function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
        }
        break;
      case 2:
        {
          x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
        }
        break;
      case 3:
        {
          x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
        }
        break;
      case 4:
        {
          x = +(+a4 * b0 + a7 * b3);
        }
        break;
      case 5:
        {
          x = +(+a5 * b0 + a7 * b1);
        }
        break;
      case 6:
        {
          x = +(+a6 * b0 + a7 * b2);
        }
        break;
      case 7:
        {
          x = +(+a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", rcoE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rcoG3.js", ["../math/compG3Get", "../math/rcoE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      rcoE3_1,
      compG3Set_1;
  function rcoG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", rcoG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(rcoE3_1_1) {
      rcoE3_1 = rcoE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/compG3Get.js", [], function(exports_1) {
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_XYZ;
  function gcompE3(m, index) {
    switch (index) {
      case COORD_W:
        {
          return m.α;
        }
      case COORD_X:
        {
          return m.x;
        }
      case COORD_Y:
        {
          return m.y;
        }
      case COORD_Z:
        {
          return m.z;
        }
      case COORD_XY:
        {
          return m.xy;
        }
      case COORD_YZ:
        {
          return m.yz;
        }
      case COORD_ZX:
        {
          return m.zx;
        }
      case COORD_XYZ:
        {
          return m.β;
        }
      default:
        {
          throw new Error("index => " + index);
        }
    }
  }
  exports_1("default", gcompE3);
  return {
    setters: [],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_XYZ = 7;
    }
  };
});

System.register("davinci-eight/math/mulE3.js", [], function(exports_1) {
  function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2);
        }
        break;
      case 7:
        {
          x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", mulE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/compG3Set.js", [], function(exports_1) {
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_XYZ;
  function compG3Set(m, index, value) {
    switch (index) {
      case COORD_W:
        m.α = value;
        break;
      case COORD_X:
        m.x = value;
        break;
      case COORD_Y:
        m.y = value;
        break;
      case COORD_Z:
        m.z = value;
        break;
      case COORD_XY:
        m.xy = value;
        break;
      case COORD_YZ:
        m.yz = value;
        break;
      case COORD_ZX:
        m.zx = value;
        break;
      case COORD_XYZ:
        m.β = value;
        break;
      default:
        throw new Error("index => " + index);
    }
  }
  exports_1("default", compG3Set);
  return {
    setters: [],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_XYZ = 7;
    }
  };
});

System.register("davinci-eight/math/scpG3.js", ["../math/compG3Get", "../math/mulE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      mulE3_1,
      compG3Set_1;
  function scpG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    compG3Set_1.default(out, 0, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
    compG3Set_1.default(out, 1, 0);
    compG3Set_1.default(out, 2, 0);
    compG3Set_1.default(out, 3, 0);
    compG3Set_1.default(out, 4, 0);
    compG3Set_1.default(out, 5, 0);
    compG3Set_1.default(out, 6, 0);
    compG3Set_1.default(out, 7, 0);
    return out;
  }
  exports_1("default", scpG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(mulE3_1_1) {
      mulE3_1 = mulE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/squaredNormG3.js", [], function(exports_1) {
  function squaredNormG3(m) {
    var w = m.α;
    var x = m.x;
    var y = m.y;
    var z = m.z;
    var yz = m.yz;
    var zx = m.zx;
    var xy = m.xy;
    var v = m.β;
    return w * w + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + v * v;
  }
  exports_1("default", squaredNormG3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/subE3.js", [], function(exports_1) {
  function subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 - b0);
        }
        break;
      case 1:
        {
          x = +(a1 - b1);
        }
        break;
      case 2:
        {
          x = +(a2 - b2);
        }
        break;
      case 3:
        {
          x = +(a3 - b3);
        }
        break;
      case 4:
        {
          x = +(a4 - b4);
        }
        break;
      case 5:
        {
          x = +(a5 - b5);
        }
        break;
      case 6:
        {
          x = +(a6 - b6);
        }
        break;
      case 7:
        {
          x = +(a7 - b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", subE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Dimensions.js", ["../math/QQ"], function(exports_1) {
  var QQ_1;
  var R0,
      R1,
      M1,
      Dimensions;
  function assertArgDimensions(name, arg) {
    if (arg instanceof Dimensions) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a Dimensions");
    }
  }
  function assertArgRational(name, arg) {
    if (arg instanceof QQ_1.default) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a QQ");
    }
  }
  return {
    setters: [function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }],
    execute: function() {
      R0 = QQ_1.default.ZERO;
      R1 = QQ_1.default.ONE;
      M1 = QQ_1.default.MINUS_ONE;
      Dimensions = (function() {
        function Dimensions(M, L, T, Q, temperature, amount, intensity) {
          this.M = M;
          this.L = L;
          this.T = T;
          this.Q = Q;
          this.temperature = temperature;
          this.amount = amount;
          this.intensity = intensity;
          assertArgRational('M', M);
          assertArgRational('L', L);
          assertArgRational('T', T);
          assertArgRational('Q', Q);
          assertArgRational('temperature', temperature);
          assertArgRational('amount', amount);
          assertArgRational('intensity', intensity);
          if (arguments.length !== 7) {
            throw new Error("Expecting 7 arguments");
          }
        }
        Dimensions.prototype.compatible = function(rhs) {
          if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this;
          } else {
            throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
          }
        };
        Dimensions.prototype.mul = function(rhs) {
          return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function(rhs) {
          return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function(exponent) {
          return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function() {
          return new Dimensions(this.M.div(QQ_1.default.TWO), this.L.div(QQ_1.default.TWO), this.T.div(QQ_1.default.TWO), this.Q.div(QQ_1.default.TWO), this.temperature.div(QQ_1.default.TWO), this.amount.div(QQ_1.default.TWO), this.intensity.div(QQ_1.default.TWO));
        };
        Dimensions.prototype.isOne = function() {
          return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.isZero = function() {
          return false;
        };
        Dimensions.prototype.inv = function() {
          return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        Dimensions.prototype.neg = function() {
          return this;
        };
        Dimensions.prototype.toString = function() {
          var stringify = function(rational, label) {
            if (rational.numer === 0) {
              return null;
            } else if (rational.denom === 1) {
              if (rational.numer === 1) {
                return "" + label;
              } else {
                return "" + label + " ** " + rational.numer;
              }
            }
            return "" + label + " ** " + rational;
          };
          return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function(x) {
            return typeof x === 'string';
          }).join(" * ");
        };
        Dimensions.prototype.__add__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.mul(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.mul(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__div__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.div(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.div(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__pos__ = function() {
          return this;
        };
        Dimensions.prototype.__neg__ = function() {
          return this;
        };
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        return Dimensions;
      })();
      exports_1("default", Dimensions);
    }
  };
});

System.register("davinci-eight/math/QQ.js", ["../checks/mustBeInteger", "../i18n/readOnly"], function(exports_1) {
  var mustBeInteger_1,
      readOnly_1;
  var QQ;
  return {
    setters: [function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      QQ = (function() {
        function QQ(n, d) {
          mustBeInteger_1.default('n', n);
          mustBeInteger_1.default('d', d);
          var g;
          var gcd = function(a, b) {
            mustBeInteger_1.default('a', a);
            mustBeInteger_1.default('b', b);
            var temp;
            if (a < 0) {
              a = -a;
            }
            if (b < 0) {
              b = -b;
            }
            if (b > a) {
              temp = a;
              a = b;
              b = temp;
            }
            while (true) {
              a %= b;
              if (a === 0) {
                return b;
              }
              b %= a;
              if (b === 0) {
                return a;
              }
            }
          };
          if (d === 0) {
            throw new Error("denominator must not be zero");
          }
          if (n === 0) {
            g = 1;
          } else {
            g = gcd(Math.abs(n), Math.abs(d));
          }
          if (d < 0) {
            n = -n;
            d = -d;
          }
          this._numer = n / g;
          this._denom = d / g;
        }
        Object.defineProperty(QQ.prototype, "numer", {
          get: function() {
            return this._numer;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('numer').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
          get: function() {
            return this._denom;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('denom').message);
          },
          enumerable: true,
          configurable: true
        });
        QQ.prototype.add = function(rhs) {
          return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function(rhs) {
          return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function(rhs) {
          return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.div = function(rhs) {
          if (typeof rhs === 'number') {
            return new QQ(this._numer, this._denom * rhs);
          } else {
            return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
          }
        };
        QQ.prototype.isOne = function() {
          return this._numer === 1 && this._denom === 1;
        };
        QQ.prototype.isZero = function() {
          return this._numer === 0 && this._denom === 1;
        };
        QQ.prototype.inv = function() {
          return new QQ(this._denom, this._numer);
        };
        QQ.prototype.neg = function() {
          return new QQ(-this._numer, this._denom);
        };
        QQ.prototype.equals = function(other) {
          if (other instanceof QQ) {
            return this._numer * other._denom === this._denom * other._numer;
          } else {
            return false;
          }
        };
        QQ.prototype.toString = function() {
          return "" + this._numer + "/" + this._denom + "";
        };
        QQ.prototype.__add__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.add(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__radd__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.add(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__sub__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.sub(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.sub(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__mul__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.mul(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.mul(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__div__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.div(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.div(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__pos__ = function() {
          return this;
        };
        QQ.prototype.__neg__ = function() {
          return this.neg();
        };
        QQ.ONE = new QQ(1, 1);
        QQ.TWO = new QQ(2, 1);
        QQ.MINUS_ONE = new QQ(-1, 1);
        QQ.ZERO = new QQ(0, 1);
        return QQ;
      })();
      exports_1("default", QQ);
    }
  };
});

System.register("davinci-eight/math/UnitError.js", [], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var UnitError;
  return {
    setters: [],
    execute: function() {
      UnitError = (function(_super) {
        __extends(UnitError, _super);
        function UnitError(message) {
          _super.call(this, message);
          this.name = 'UnitError';
        }
        return UnitError;
      })(Error);
      exports_1("default", UnitError);
    }
  };
});

System.register("davinci-eight/math/Unit.js", ["../math/Dimensions", "../math/QQ", "../math/UnitError"], function(exports_1) {
  var Dimensions_1,
      QQ_1,
      UnitError_1;
  var LABELS_SI,
      dumbString,
      unitString,
      Unit;
  function assertArgNumber(name, x) {
    if (typeof x === 'number') {
      return x;
    } else {
      throw new UnitError_1.default("Argument '" + name + "' must be a number");
    }
  }
  function assertArgDimensions(name, arg) {
    if (arg instanceof Dimensions_1.default) {
      return arg;
    } else {
      throw new UnitError_1.default("Argument '" + arg + "' must be a Dimensions");
    }
  }
  function assertArgRational(name, arg) {
    if (arg instanceof QQ_1.default) {
      return arg;
    } else {
      throw new UnitError_1.default("Argument '" + arg + "' must be a QQ");
    }
  }
  function assertArgUnit(name, arg) {
    if (arg instanceof Unit) {
      return arg;
    } else {
      throw new UnitError_1.default("Argument '" + arg + "' must be a Unit");
    }
  }
  function assertArgUnitOrUndefined(name, arg) {
    if (typeof arg === 'undefined') {
      return arg;
    } else {
      return assertArgUnit(name, arg);
    }
  }
  function add(lhs, rhs) {
    return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
  }
  function sub(lhs, rhs) {
    return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
  }
  function mul(lhs, rhs) {
    return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
  }
  function scale(α, unit) {
    return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
  }
  function div(lhs, rhs) {
    return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
  }
  return {
    setters: [function(Dimensions_1_1) {
      Dimensions_1 = Dimensions_1_1;
    }, function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }, function(UnitError_1_1) {
      UnitError_1 = UnitError_1_1;
    }],
    execute: function() {
      LABELS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'candela'];
      dumbString = function(multiplier, dimensions, labels) {
        assertArgNumber('multiplier', multiplier);
        assertArgDimensions('dimensions', dimensions);
        var operatorStr;
        var scaleString;
        var unitsString;
        var stringify = function(rational, label) {
          if (rational.numer === 0) {
            return null;
          } else if (rational.denom === 1) {
            if (rational.numer === 1) {
              return "" + label;
            } else {
              return "" + label + " ** " + rational.numer;
            }
          }
          return "" + label + " ** " + rational;
        };
        operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        scaleString = multiplier === 1 ? "" : "" + multiplier;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
          return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
      };
      unitString = function(multiplier, dimensions, labels) {
        var patterns = [[-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, 3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]];
        var decodes = [["F/m"], ["S"], ["F"], ["N·m ** 2/kg ** 2"], ["Hz"], ["A"], ["m/s ** 2"], ["m/s"], ["kg·m/s"], ["Pa"], ["Pa·s"], ["W/m ** 2"], ["N/m"], ["T"], ["W/(m·K)"], ["V/m"], ["N"], ["H/m"], ["J/K"], ["J/(kg·K)"], ["J/(mol·K)"], ["J/mol"], ["J"], ["J·s"], ["W"], ["V"], ["Ω"], ["H"], ["Wb"]];
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0,
            len = patterns.length; i < len; i++) {
          var pattern = patterns[i];
          if (M.numer === pattern[0] && M.denom === pattern[1] && L.numer === pattern[2] && L.denom === pattern[3] && T.numer === pattern[4] && T.denom === pattern[5] && Q.numer === pattern[6] && Q.denom === pattern[7] && temperature.numer === pattern[8] && temperature.denom === pattern[9] && amount.numer === pattern[10] && amount.denom === pattern[11] && intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
            if (multiplier !== 1) {
              return multiplier + " * " + decodes[i][0];
            } else {
              return decodes[i][0];
            }
          }
        }
        return dumbString(multiplier, dimensions, labels);
      };
      Unit = (function() {
        function Unit(multiplier, dimensions, labels) {
          this.multiplier = multiplier;
          this.dimensions = dimensions;
          this.labels = labels;
          if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
          }
          this.multiplier = multiplier;
          this.dimensions = dimensions;
          this.labels = labels;
        }
        Unit.prototype.compatible = function(rhs) {
          if (rhs instanceof Unit) {
            this.dimensions.compatible(rhs.dimensions);
            return this;
          } else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
          }
        };
        Unit.prototype.add = function(rhs) {
          assertArgUnit('rhs', rhs);
          return add(this, rhs);
        };
        Unit.prototype.__add__ = function(rhs) {
          if (rhs instanceof Unit) {
            return add(this, rhs);
          } else {
            return;
          }
        };
        Unit.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Unit) {
            return add(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.sub = function(rhs) {
          assertArgUnit('rhs', rhs);
          return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Unit) {
            return sub(this, rhs);
          } else {
            return;
          }
        };
        Unit.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Unit) {
            return sub(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.mul = function(rhs) {
          assertArgUnit('rhs', rhs);
          return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Unit) {
            return mul(this, rhs);
          } else if (typeof rhs === 'number') {
            return scale(rhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Unit) {
            return mul(lhs, this);
          } else if (typeof lhs === 'number') {
            return scale(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.div = function(rhs) {
          assertArgUnit('rhs', rhs);
          return div(this, rhs);
        };
        Unit.prototype.divByScalar = function(α) {
          return new Unit(this.multiplier / α, this.dimensions, this.labels);
        };
        Unit.prototype.__div__ = function(other) {
          if (other instanceof Unit) {
            return div(this, other);
          } else if (typeof other === 'number') {
            return new Unit(this.multiplier / other, this.dimensions, this.labels);
          } else {
            return;
          }
        };
        Unit.prototype.__rdiv__ = function(other) {
          if (other instanceof Unit) {
            return div(other, this);
          } else if (typeof other === 'number') {
            return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
          } else {
            return;
          }
        };
        Unit.prototype.pow = function(exponent) {
          assertArgRational('exponent', exponent);
          return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function() {
          return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function() {
          return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function() {
          return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.isZero = function() {
          return this.dimensions.isZero() || (this.multiplier === 0);
        };
        Unit.prototype.lerp = function(target, α) {
          return this;
        };
        Unit.prototype.norm = function() {
          return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function() {
          return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.reflect = function(n) {
          return this;
        };
        Unit.prototype.rotate = function(rotor) {
          return this;
        };
        Unit.prototype.scale = function(α) {
          return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        Unit.prototype.slerp = function(target, α) {
          return this;
        };
        Unit.prototype.toExponential = function() {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toFixed = function(digits) {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toString = function() {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.__pos__ = function() {
          return this;
        };
        Unit.prototype.__neg__ = function() {
          return this.neg();
        };
        Unit.isOne = function(uom) {
          if (typeof uom === 'undefined') {
            return true;
          } else if (uom instanceof Unit) {
            return uom.isOne();
          } else {
            throw new Error("isOne argument must be a Unit or undefined.");
          }
        };
        Unit.assertDimensionless = function(uom) {
          if (!Unit.isOne(uom)) {
            throw new UnitError_1.default("uom must be dimensionless.");
          }
        };
        Unit.compatible = function(lhs, rhs) {
          assertArgUnitOrUndefined('lhs', lhs);
          assertArgUnitOrUndefined('rhs', rhs);
          if (lhs) {
            if (rhs) {
              return lhs.compatible(rhs);
            } else {
              if (lhs.isOne()) {
                return void 0;
              } else {
                throw new UnitError_1.default(lhs + " is incompatible with 1");
              }
            }
          } else {
            if (rhs) {
              if (rhs.isOne()) {
                return void 0;
              } else {
                throw new UnitError_1.default("1 is incompatible with " + rhs);
              }
            } else {
              return void 0;
            }
          }
        };
        Unit.mul = function(lhs, rhs) {
          if (lhs instanceof Unit) {
            if (rhs instanceof Unit) {
              return lhs.mul(rhs);
            } else if (Unit.isOne(rhs)) {
              return lhs;
            } else {
              return void 0;
            }
          } else if (Unit.isOne(lhs)) {
            return rhs;
          } else {
            return void 0;
          }
        };
        Unit.div = function(lhs, rhs) {
          if (lhs instanceof Unit) {
            if (rhs instanceof Unit) {
              return lhs.div(rhs);
            } else {
              return lhs;
            }
          } else {
            if (rhs instanceof Unit) {
              return rhs.inv();
            } else {
              return void 0;
            }
          }
        };
        Unit.sqrt = function(uom) {
          if (typeof uom !== 'undefined') {
            assertArgUnit('uom', uom);
            if (!uom.isOne()) {
              return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
            } else {
              return void 0;
            }
          } else {
            return void 0;
          }
        };
        Unit.ONE = new Unit(1.0, Dimensions_1.default.ONE, LABELS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions_1.default.MASS, LABELS_SI);
        Unit.METER = new Unit(1.0, Dimensions_1.default.LENGTH, LABELS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions_1.default.TIME, LABELS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions_1.default.CHARGE, LABELS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions_1.default.CURRENT, LABELS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions_1.default.TEMPERATURE, LABELS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions_1.default.AMOUNT, LABELS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions_1.default.INTENSITY, LABELS_SI);
        return Unit;
      })();
      exports_1("default", Unit);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_GEOMETRIC.js", [], function(exports_1) {
  var SCALAR_POS_SYMBOL,
      E1_NEG_SYMBOL,
      E1_POS_SYMBOL,
      E2_POS_SYMBOL,
      E2_NEG_SYMBOL,
      E3_POS_SYMBOL,
      E3_NEG_SYMBOL,
      E12_NEG_SYMBOL,
      E12_POS_SYMBOL,
      E31_POS_SYMBOL,
      E31_NEG_SYMBOL,
      E23_NEG_SYMBOL,
      E23_POS_SYMBOL,
      PSEUDO_POS_SYMBOL,
      PSEUDO_NEG_SYMBOL,
      BASIS_LABELS_G3_GEOMETRIC;
  return {
    setters: [],
    execute: function() {
      SCALAR_POS_SYMBOL = "1";
      E1_NEG_SYMBOL = "←";
      E1_POS_SYMBOL = "→";
      E2_POS_SYMBOL = "↑";
      E2_NEG_SYMBOL = "↓";
      E3_POS_SYMBOL = "⊙";
      E3_NEG_SYMBOL = "⊗";
      E12_NEG_SYMBOL = "↻";
      E12_POS_SYMBOL = "↺";
      E31_POS_SYMBOL = "⊶";
      E31_NEG_SYMBOL = "⊷";
      E23_NEG_SYMBOL = "⬘";
      E23_POS_SYMBOL = "⬙";
      PSEUDO_POS_SYMBOL = "☐";
      PSEUDO_NEG_SYMBOL = "■";
      BASIS_LABELS_G3_GEOMETRIC = [[SCALAR_POS_SYMBOL, SCALAR_POS_SYMBOL], [E1_NEG_SYMBOL, E1_POS_SYMBOL], [E2_NEG_SYMBOL, E2_POS_SYMBOL], [E3_NEG_SYMBOL, E3_POS_SYMBOL], [E12_NEG_SYMBOL, E12_POS_SYMBOL], [E23_NEG_SYMBOL, E23_POS_SYMBOL], [E31_NEG_SYMBOL, E31_POS_SYMBOL], [PSEUDO_NEG_SYMBOL, PSEUDO_POS_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_GEOMETRIC);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_HAMILTON.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_HAMILTON;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "i";
      E2_SYMBOL = "j";
      E3_SYMBOL = "k";
      E12_SYMBOL = "ij";
      E23_SYMBOL = "jk";
      E31_SYMBOL = "ki";
      PSEUDO_SYMBOL = "ijk";
      BASIS_LABELS_G3_HAMILTON = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_HAMILTON);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_STANDARD.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_STANDARD;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "e1";
      E2_SYMBOL = "e2";
      E3_SYMBOL = "e3";
      E12_SYMBOL = "e12";
      E23_SYMBOL = "e23";
      E31_SYMBOL = "e31";
      PSEUDO_SYMBOL = "I";
      BASIS_LABELS_G3_STANDARD = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_STANDARD);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_STANDARD_HTML.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_STANDARD_HTML;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "<b>e</b><sub>1</sub>";
      E2_SYMBOL = "<b>e</b><sub>2</sub>";
      E3_SYMBOL = "<b>e</b><sub>3</sub>";
      E12_SYMBOL = E1_SYMBOL + E2_SYMBOL;
      E23_SYMBOL = E2_SYMBOL + E3_SYMBOL;
      E31_SYMBOL = E3_SYMBOL + E1_SYMBOL;
      PSEUDO_SYMBOL = E1_SYMBOL + E2_SYMBOL + E3_SYMBOL;
      BASIS_LABELS_G3_STANDARD_HTML = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_STANDARD_HTML);
    }
  };
});

System.register("davinci-eight/math/Euclidean3.js", ["../math/addE3", "../geometries/b2", "../geometries/b3", "../math/extG3", "../checks/isDefined", "../math/lcoG3", "../math/mulE3", "../math/mulG3", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/NotImplementedError", "../math/rcoG3", "../i18n/readOnly", "../math/scpG3", "../math/squaredNormG3", "../math/stringFromCoordinates", "../math/subE3", "../math/Unit", "../math/BASIS_LABELS_G3_GEOMETRIC", "../math/BASIS_LABELS_G3_HAMILTON", "../math/BASIS_LABELS_G3_STANDARD", "../math/BASIS_LABELS_G3_STANDARD_HTML"], function(exports_1) {
  var addE3_1,
      b2_1,
      b3_1,
      extG3_1,
      isDefined_1,
      lcoG3_1,
      mulE3_1,
      mulG3_1,
      mustBeInteger_1,
      mustBeNumber_1,
      NotImplementedError_1,
      rcoG3_1,
      readOnly_1,
      scpG3_1,
      squaredNormG3_1,
      stringFromCoordinates_1,
      subE3_1,
      Unit_1,
      BASIS_LABELS_G3_GEOMETRIC_1,
      BASIS_LABELS_G3_HAMILTON_1,
      BASIS_LABELS_G3_STANDARD_1,
      BASIS_LABELS_G3_STANDARD_HTML_1;
  var cos,
      sin,
      sqrt,
      divide,
      Euclidean3;
  function assertArgEuclidean3(name, arg) {
    if (arg instanceof Euclidean3) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a Euclidean3");
    }
  }
  function assertArgUnitOrUndefined(name, uom) {
    if (typeof uom === 'undefined' || uom instanceof Unit_1.default) {
      return uom;
    } else {
      throw new Error("Argument '" + uom + "' must be a Unit or undefined");
    }
  }
  function compute(f, a, b, coord, pack, uom) {
    var a0 = coord(a, 0);
    var a1 = coord(a, 1);
    var a2 = coord(a, 2);
    var a3 = coord(a, 3);
    var a4 = coord(a, 4);
    var a5 = coord(a, 5);
    var a6 = coord(a, 6);
    var a7 = coord(a, 7);
    var b0 = coord(b, 0);
    var b1 = coord(b, 1);
    var b2 = coord(b, 2);
    var b3 = coord(b, 3);
    var b4 = coord(b, 4);
    var b5 = coord(b, 5);
    var b6 = coord(b, 6);
    var b7 = coord(b, 7);
    var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
    var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
    var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
    var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
    var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
    var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
    var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
    var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
    return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
  }
  return {
    setters: [function(addE3_1_1) {
      addE3_1 = addE3_1_1;
    }, function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(extG3_1_1) {
      extG3_1 = extG3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(lcoG3_1_1) {
      lcoG3_1 = lcoG3_1_1;
    }, function(mulE3_1_1) {
      mulE3_1 = mulE3_1_1;
    }, function(mulG3_1_1) {
      mulG3_1 = mulG3_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(NotImplementedError_1_1) {
      NotImplementedError_1 = NotImplementedError_1_1;
    }, function(rcoG3_1_1) {
      rcoG3_1 = rcoG3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(scpG3_1_1) {
      scpG3_1 = scpG3_1_1;
    }, function(squaredNormG3_1_1) {
      squaredNormG3_1 = squaredNormG3_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(subE3_1_1) {
      subE3_1 = subE3_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }, function(BASIS_LABELS_G3_GEOMETRIC_1_1) {
      BASIS_LABELS_G3_GEOMETRIC_1 = BASIS_LABELS_G3_GEOMETRIC_1_1;
    }, function(BASIS_LABELS_G3_HAMILTON_1_1) {
      BASIS_LABELS_G3_HAMILTON_1 = BASIS_LABELS_G3_HAMILTON_1_1;
    }, function(BASIS_LABELS_G3_STANDARD_1_1) {
      BASIS_LABELS_G3_STANDARD_1 = BASIS_LABELS_G3_STANDARD_1_1;
    }, function(BASIS_LABELS_G3_STANDARD_HTML_1_1) {
      BASIS_LABELS_G3_STANDARD_HTML_1 = BASIS_LABELS_G3_STANDARD_HTML_1_1;
    }],
    execute: function() {
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      divide = function(a000, a001, a010, a011, a100, a101, a110, a111, b000, b001, b010, b011, b100, b101, b110, b111, uom) {
        var c000;
        var c001;
        var c010;
        var c011;
        var c100;
        var c101;
        var c110;
        var c111;
        var i000;
        var i001;
        var i010;
        var i011;
        var i100;
        var i101;
        var i110;
        var i111;
        var k000;
        var m000;
        var m001;
        var m010;
        var m011;
        var m100;
        var m101;
        var m110;
        var m111;
        var r000;
        var r001;
        var r010;
        var r011;
        var r100;
        var r101;
        var r110;
        var r111;
        var s000;
        var s001;
        var s010;
        var s011;
        var s100;
        var s101;
        var s110;
        var s111;
        var w;
        var x;
        var x000;
        var x001;
        var x010;
        var x011;
        var x100;
        var x101;
        var x110;
        var x111;
        var xy;
        var β;
        var y;
        var yz;
        var z;
        var zx;
        r000 = +b000;
        r001 = +b001;
        r010 = +b010;
        r011 = -b011;
        r100 = +b100;
        r101 = -b101;
        r110 = -b110;
        r111 = -b111;
        m000 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        s000 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3_1.default(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        k000 = mulE3_1.default(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        x000 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3_1.default(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        w = x000;
        x = x001;
        y = x010;
        z = x100;
        xy = x011;
        yz = x110;
        zx = -x101;
        β = x111;
        return new Euclidean3(w, x, y, z, xy, yz, zx, β, uom);
      };
      Euclidean3 = (function() {
        function Euclidean3(α, x, y, z, xy, yz, zx, β, uom) {
          this.w = mustBeNumber_1.default('α', α);
          this.x = mustBeNumber_1.default('x', x);
          this.y = mustBeNumber_1.default('y', y);
          this.z = mustBeNumber_1.default('z', z);
          this.xy = mustBeNumber_1.default('xy', xy);
          this.yz = mustBeNumber_1.default('yz', yz);
          this.zx = mustBeNumber_1.default('zx', zx);
          this.xyz = mustBeNumber_1.default('β', β);
          this.uom = assertArgUnitOrUndefined('uom', uom);
          if (this.uom && this.uom.multiplier !== 1) {
            var multiplier = this.uom.multiplier;
            this.w *= multiplier;
            this.x *= multiplier;
            this.y *= multiplier;
            this.z *= multiplier;
            this.xy *= multiplier;
            this.yz *= multiplier;
            this.zx *= multiplier;
            this.xyz *= multiplier;
            this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
          }
        }
        Object.defineProperty(Euclidean3, "BASIS_LABELS_GEOMETRIC", {
          get: function() {
            return BASIS_LABELS_G3_GEOMETRIC_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_HAMILTON", {
          get: function() {
            return BASIS_LABELS_G3_HAMILTON_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD", {
          get: function() {
            return BASIS_LABELS_G3_STANDARD_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(Euclidean3, "BASIS_LABELS_STANDARD_HTML", {
          get: function() {
            return BASIS_LABELS_G3_STANDARD_HTML_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(Euclidean3.prototype, "α", {
          get: function() {
            return this.w;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('α').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Euclidean3.prototype, "β", {
          get: function() {
            return this.xyz;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('β').message);
          },
          enumerable: true,
          configurable: true
        });
        Euclidean3.fromCartesian = function(α, x, y, z, xy, yz, zx, β, uom) {
          mustBeNumber_1.default('α', α);
          mustBeNumber_1.default('x', x);
          mustBeNumber_1.default('y', y);
          mustBeNumber_1.default('z', z);
          mustBeNumber_1.default('xy', xy);
          mustBeNumber_1.default('yz', yz);
          mustBeNumber_1.default('zx', zx);
          mustBeNumber_1.default('β', β);
          assertArgUnitOrUndefined('uom', uom);
          return new Euclidean3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(Euclidean3.prototype, "coords", {
          get: function() {
            return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
          },
          enumerable: true,
          configurable: true
        });
        Euclidean3.prototype.coordinate = function(index) {
          mustBeNumber_1.default('index', index);
          switch (index) {
            case 0:
              return this.w;
            case 1:
              return this.x;
            case 2:
              return this.y;
            case 3:
              return this.z;
            case 4:
              return this.xy;
            case 5:
              return this.yz;
            case 6:
              return this.zx;
            case 7:
              return this.xyz;
            default:
              throw new Error("index must be in the range [0..7]");
          }
        };
        Euclidean3.prototype.add = function(rhs) {
          var coord = function(x, n) {
            return x[n];
          };
          var pack = function(w, x, y, z, xy, yz, zx, xyz, uom) {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
          };
          return compute(addE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.addPseudo = function(β) {
          if (isDefined_1.default(β)) {
            mustBeNumber_1.default('β', β);
            return new Euclidean3(this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz + β, this.uom);
          } else {
            return void 0;
          }
        };
        Euclidean3.prototype.addScalar = function(α) {
          if (isDefined_1.default(α)) {
            mustBeNumber_1.default('α', α);
            return new Euclidean3(this.w + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz, this.uom);
          } else {
            return void 0;
          }
        };
        Euclidean3.prototype.__add__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.add(rhs);
          } else if (typeof rhs === 'number') {
            return this.addScalar(rhs);
          }
        };
        Euclidean3.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.add(this);
          } else if (typeof lhs === 'number') {
            return this.addScalar(lhs);
          }
        };
        Euclidean3.prototype.adj = function() {
          return this;
        };
        Euclidean3.prototype.angle = function() {
          return this.log().grade(2);
        };
        Euclidean3.prototype.conj = function() {
          return new Euclidean3(this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.xyz, this.uom);
        };
        Euclidean3.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          var z = b3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
          return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.direction = function() {
          return this.div(this.norm());
        };
        Euclidean3.prototype.sub = function(rhs) {
          var coord = function(x, n) {
            return x[n];
          };
          var pack = function(w, x, y, z, xy, yz, zx, xyz, uom) {
            return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
          };
          return compute(subE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.sub(rhs);
          } else if (typeof rhs === 'number') {
            return this.addScalar(-rhs);
          }
        };
        Euclidean3.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.sub(this);
          } else if (typeof lhs === 'number') {
            return this.neg().addScalar(lhs);
          }
        };
        Euclidean3.prototype.mul = function(rhs) {
          var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          mulG3_1.default(this, rhs, Euclidean3.mutator(out));
          return out;
        };
        Euclidean3.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.scale(rhs);
          }
        };
        Euclidean3.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.mul(this);
          } else if (typeof lhs === 'number') {
            return this.scale(lhs);
          }
        };
        Euclidean3.prototype.scale = function(α) {
          return new Euclidean3(this.w * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.xyz * α, this.uom);
        };
        Euclidean3.prototype.div = function(rhs) {
          assertArgEuclidean3('rhs', rhs);
          return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit_1.default.div(this.uom, rhs.uom));
        };
        Euclidean3.prototype.divByScalar = function(α) {
          return new Euclidean3(this.w / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.xyz / α, this.uom);
        };
        Euclidean3.prototype.__div__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.div(rhs);
          } else if (typeof rhs === 'number') {
            return this.divByScalar(rhs);
          }
        };
        Euclidean3.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.div(this);
          } else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
          }
        };
        Euclidean3.prototype.dual = function() {
          return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.scp = function(rhs) {
          var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          scpG3_1.default(this, rhs, Euclidean3.mutator(out));
          return out;
        };
        Euclidean3.prototype.ext = function(rhs) {
          var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          extG3_1.default(this, rhs, Euclidean3.mutator(out));
          return out;
        };
        Euclidean3.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.scp(rhs);
          } else if (typeof rhs === 'number') {
            return this.scp(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        Euclidean3.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.scp(this);
          } else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
          }
        };
        Euclidean3.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.ext(rhs);
          } else if (typeof rhs === 'number') {
            return this.scale(rhs);
          }
        };
        Euclidean3.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.ext(this);
          } else if (typeof lhs === 'number') {
            return this.scale(lhs);
          }
        };
        Euclidean3.prototype.lco = function(rhs) {
          var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          lcoG3_1.default(this, rhs, Euclidean3.mutator(out));
          return out;
        };
        Euclidean3.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.lco(rhs);
          } else if (typeof rhs === 'number') {
            return this.lco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        Euclidean3.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.lco(this);
          } else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
          }
        };
        Euclidean3.prototype.rco = function(rhs) {
          var out = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          rcoG3_1.default(this, rhs, Euclidean3.mutator(out));
          return out;
        };
        Euclidean3.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof Euclidean3) {
            return this.rco(rhs);
          } else if (typeof rhs === 'number') {
            return this.rco(new Euclidean3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        Euclidean3.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof Euclidean3) {
            return lhs.rco(this);
          } else if (typeof lhs === 'number') {
            return new Euclidean3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
          }
        };
        Euclidean3.prototype.pow = function(exponent) {
          throw new Error('pow');
        };
        Euclidean3.prototype.__bang__ = function() {
          return this.inv();
        };
        Euclidean3.prototype.__pos__ = function() {
          return this;
        };
        Euclidean3.prototype.neg = function() {
          return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.__neg__ = function() {
          return this.neg();
        };
        Euclidean3.prototype.rev = function() {
          return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.__tilde__ = function() {
          return this.rev();
        };
        Euclidean3.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              return Euclidean3.fromCartesian(this.w, 0, 0, 0, 0, 0, 0, 0, this.uom);
            case 1:
              return Euclidean3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
            case 2:
              return Euclidean3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
            case 3:
              return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.xyz, this.uom);
            default:
              return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
          }
        };
        Euclidean3.prototype.cross = function(vector) {
          var x;
          var x1;
          var x2;
          var y;
          var y1;
          var y2;
          var z;
          var z1;
          var z2;
          x1 = this.x;
          y1 = this.y;
          z1 = this.z;
          x2 = vector.x;
          y2 = vector.y;
          z2 = vector.z;
          x = y1 * z2 - z1 * y2;
          y = z1 * x2 - x1 * z2;
          z = x1 * y2 - y1 * x2;
          return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit_1.default.mul(this.uom, vector.uom));
        };
        Euclidean3.prototype.isOne = function() {
          return (this.w === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        Euclidean3.prototype.isZero = function() {
          return (this.w === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.xyz === 0);
        };
        Euclidean3.prototype.lerp = function(target, α) {
          return this;
        };
        Euclidean3.prototype.cos = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var cosW = cos(this.w);
          return new Euclidean3(cosW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.cosh = function() {
          throw new NotImplementedError_1.default('cosh(Euclidean3)');
        };
        Euclidean3.prototype.distanceTo = function(point) {
          var dx = this.x - point.x;
          var dy = this.y - point.y;
          var dz = this.z - point.z;
          return sqrt(dx * dx + dy * dy + dz * dz);
        };
        Euclidean3.prototype.equals = function(other) {
          throw new Error("TODO: Euclidean3.equals");
        };
        Euclidean3.prototype.exp = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var bivector = this.grade(2);
          var a = bivector.norm();
          if (!a.isZero()) {
            var c = a.cos();
            var s = a.sin();
            var B = bivector.direction();
            return c.add(B.mul(s));
          } else {
            return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
          }
        };
        Euclidean3.prototype.inv = function() {
          return this.rev().divByScalar(this.squaredNormSansUnits());
        };
        Euclidean3.prototype.log = function() {
          return new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.magnitude = function() {
          return this.norm();
        };
        Euclidean3.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        Euclidean3.prototype.norm = function() {
          return new Euclidean3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.quad = function() {
          return this.squaredNorm();
        };
        Euclidean3.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          var z = b2_1.default(t, this.z, controlPoint.z, endPoint.z);
          return new Euclidean3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        Euclidean3.prototype.squaredNorm = function() {
          return new Euclidean3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean3.prototype.squaredNormSansUnits = function() {
          return squaredNormG3_1.default(this);
        };
        Euclidean3.prototype.reflect = function(n) {
          var m = Euclidean3.fromVectorE3(n);
          return m.mul(this).mul(m).scale(-1);
        };
        Euclidean3.prototype.rotate = function(s) {
          return this;
        };
        Euclidean3.prototype.sin = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var sinW = sin(this.w);
          return new Euclidean3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        Euclidean3.prototype.sinh = function() {
          throw new Error('sinh');
        };
        Euclidean3.prototype.slerp = function(target, α) {
          return this;
        };
        Euclidean3.prototype.sqrt = function() {
          return new Euclidean3(sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.sqrt(this.uom));
        };
        Euclidean3.prototype.tan = function() {
          return this.sin().div(this.cos());
        };
        Euclidean3.prototype.toStringCustom = function(coordToString, labels) {
          var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
          if (this.uom) {
            var unitString = this.uom.toString().trim();
            if (unitString) {
              return quantityString + ' ' + unitString;
            } else {
              return quantityString;
            }
          } else {
            return quantityString;
          }
        };
        Euclidean3.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, Euclidean3.BASIS_LABELS);
        };
        Euclidean3.mutator = function(M) {
          var that = {
            set α(α) {
              M.w = α;
            },
            set x(x) {
              M.x = x;
            },
            set y(y) {
              M.y = y;
            },
            set z(z) {
              M.z = z;
            },
            set yz(yz) {
              M.yz = yz;
            },
            set zx(zx) {
              M.zx = zx;
            },
            set xy(xy) {
              M.xy = xy;
            },
            set β(β) {
              M.xyz = β;
            }
          };
          return that;
        };
        Euclidean3.copy = function(m) {
          if (m instanceof Euclidean3) {
            return m;
          } else {
            return new Euclidean3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, void 0);
          }
        };
        Euclidean3.fromSpinorE3 = function(spinor) {
          if (isDefined_1.default(spinor)) {
            return new Euclidean3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
          } else {
            return void 0;
          }
        };
        Euclidean3.fromVectorE3 = function(vector) {
          if (isDefined_1.default(vector)) {
            return new Euclidean3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, void 0);
          } else {
            return void 0;
          }
        };
        Euclidean3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        Euclidean3.zero = new Euclidean3(0, 0, 0, 0, 0, 0, 0, 0);
        Euclidean3.one = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0);
        Euclidean3.e1 = new Euclidean3(0, 1, 0, 0, 0, 0, 0, 0);
        Euclidean3.e2 = new Euclidean3(0, 0, 1, 0, 0, 0, 0, 0);
        Euclidean3.e3 = new Euclidean3(0, 0, 0, 1, 0, 0, 0, 0);
        Euclidean3.kilogram = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KILOGRAM);
        Euclidean3.meter = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.METER);
        Euclidean3.second = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.SECOND);
        Euclidean3.coulomb = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.COULOMB);
        Euclidean3.ampere = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.AMPERE);
        Euclidean3.kelvin = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KELVIN);
        Euclidean3.mole = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.MOLE);
        Euclidean3.candela = new Euclidean3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.CANDELA);
        return Euclidean3;
      })();
      exports_1("default", Euclidean3);
    }
  };
});

System.register("davinci-eight/math/add3x3.js", [], function(exports_1) {
  function default_1(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x3],
        a13 = a[0x6];
    var a21 = a[0x1],
        a22 = a[0x4],
        a23 = a[0x7];
    var a31 = a[0x2],
        a32 = a[0x5],
        a33 = a[0x8];
    var b11 = b[0x0],
        b12 = b[0x3],
        b13 = b[0x6];
    var b21 = b[0x1],
        b22 = b[0x4],
        b23 = b[0x7];
    var b31 = b[0x2],
        b32 = b[0x5],
        b33 = b[0x8];
    c[0x0] = a11 + b11;
    c[0x3] = a12 + b12;
    c[0x6] = a13 + b13;
    c[0x1] = a21 + b21;
    c[0x4] = a22 + b22;
    c[0x7] = a23 + b23;
    c[0x2] = a31 + b31;
    c[0x5] = a32 + b32;
    c[0x8] = a33 + b33;
    return c;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/det3x3.js", [], function(exports_1) {
  function default_1(m) {
    var m00 = m[0x0],
        m01 = m[0x3],
        m02 = m[0x6];
    var m10 = m[0x1],
        m11 = m[0x4],
        m12 = m[0x7];
    var m20 = m[0x2],
        m21 = m[0x5],
        m22 = m[0x8];
    return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/inv3x3.js", ["../math/det3x3"], function(exports_1) {
  var det3x3_1;
  function inv3x3(m, te) {
    var det = det3x3_1.default(m);
    var m11 = m[0x0],
        m12 = m[0x3],
        m13 = m[0x6];
    var m21 = m[0x1],
        m22 = m[0x4],
        m23 = m[0x7];
    var m31 = m[0x2],
        m32 = m[0x5],
        m33 = m[0x8];
    var o11 = m22 * m33 - m23 * m32;
    var o12 = m13 * m32 - m12 * m33;
    var o13 = m12 * m23 - m13 * m22;
    var o21 = m23 * m31 - m21 * m33;
    var o22 = m11 * m33 - m13 * m31;
    var o23 = m13 * m21 - m11 * m23;
    var o31 = m21 * m32 - m22 * m31;
    var o32 = m12 * m31 - m11 * m32;
    var o33 = m11 * m22 - m12 * m21;
    var α = 1 / det;
    te[0x0] = o11 * α;
    te[0x3] = o12 * α;
    te[0x6] = o13 * α;
    te[0x1] = o21 * α;
    te[0x4] = o22 * α;
    te[0x7] = o23 * α;
    te[0x2] = o31 * α;
    te[0x5] = o32 * α;
    te[0x8] = o33 * α;
  }
  exports_1("default", inv3x3);
  return {
    setters: [function(det3x3_1_1) {
      det3x3_1 = det3x3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mul3x3.js", [], function(exports_1) {
  function mul3x3(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x3],
        a13 = a[0x6];
    var a21 = a[0x1],
        a22 = a[0x4],
        a23 = a[0x7];
    var a31 = a[0x2],
        a32 = a[0x5],
        a33 = a[0x8];
    var b11 = b[0x0],
        b12 = b[0x3],
        b13 = b[0x6];
    var b21 = b[0x1],
        b22 = b[0x4],
        b23 = b[0x7];
    var b31 = b[0x2],
        b32 = b[0x5],
        b33 = b[0x8];
    c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
    c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
    c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
    c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
    c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
    c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
    c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
    c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
    c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
    return c;
  }
  exports_1("default", mul3x3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Mat3R.js", ["../math/AbstractMatrix", "../math/add3x3", "../math/det3x3", "../math/inv3x3", "../math/mul3x3", "../checks/mustBeNumber"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add3x3_1,
      det3x3_1,
      inv3x3_1,
      mul3x3_1,
      mustBeNumber_1;
  var Mat3R;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add3x3_1_1) {
      add3x3_1 = add3x3_1_1;
    }, function(det3x3_1_1) {
      det3x3_1 = det3x3_1_1;
    }, function(inv3x3_1_1) {
      inv3x3_1 = inv3x3_1_1;
    }, function(mul3x3_1_1) {
      mul3x3_1 = mul3x3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {
      Mat3R = (function(_super) {
        __extends(Mat3R, _super);
        function Mat3R(elements) {
          _super.call(this, elements, 3);
        }
        Mat3R.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Mat3R.prototype.add2 = function(a, b) {
          add3x3_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Mat3R.prototype.clone = function() {
          return Mat3R.zero().copy(this);
        };
        Mat3R.prototype.det = function() {
          return det3x3_1.default(this.elements);
        };
        Mat3R.prototype.getInverse = function(matrix, throwOnInvertible) {
          var me = matrix.elements;
          var te = this.elements;
          te[0] = me[10] * me[5] - me[6] * me[9];
          te[1] = -me[10] * me[1] + me[2] * me[9];
          te[2] = me[6] * me[1] - me[2] * me[5];
          te[3] = -me[10] * me[4] + me[6] * me[8];
          te[4] = me[10] * me[0] - me[2] * me[8];
          te[5] = -me[6] * me[0] + me[2] * me[4];
          te[6] = me[9] * me[4] - me[5] * me[8];
          te[7] = -me[9] * me[0] + me[1] * me[8];
          te[8] = me[5] * me[0] - me[1] * me[4];
          var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
          if (det === 0) {
            var msg = "Mat3R.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || !throwOnInvertible) {
              throw new Error(msg);
            } else {
              console.warn(msg);
            }
            this.one();
            return this;
          }
          this.scale(1.0 / det);
          return this;
        };
        Mat3R.prototype.inv = function() {
          inv3x3_1.default(this.elements, this.elements);
          return this;
        };
        Mat3R.prototype.isOne = function() {
          var te = this.elements;
          var m11 = te[0x0],
              m12 = te[0x3],
              m13 = te[0x6];
          var m21 = te[0x1],
              m22 = te[0x4],
              m23 = te[0x7];
          var m31 = te[0x2],
              m32 = te[0x5],
              m33 = te[0x8];
          return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
        };
        Mat3R.prototype.isZero = function() {
          var te = this.elements;
          var m11 = te[0x0],
              m12 = te[0x3],
              m13 = te[0x6];
          var m21 = te[0x1],
              m22 = te[0x4],
              m23 = te[0x7];
          var m31 = te[0x2],
              m32 = te[0x5],
              m33 = te[0x8];
          return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
        };
        Mat3R.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Mat3R.prototype.mul2 = function(a, b) {
          mul3x3_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Mat3R.prototype.neg = function() {
          return this.scale(-1);
        };
        Mat3R.prototype.normalFromMat4R = function(m) {
          return this.getInverse(m).transpose();
        };
        Mat3R.prototype.one = function() {
          return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Mat3R.prototype.reflection = function(n) {
          var nx = mustBeNumber_1.default('n.x', n.x);
          var ny = mustBeNumber_1.default('n.y', n.y);
          var aa = -2 * nx * ny;
          var xx = 1 - 2 * nx * nx;
          var yy = 1 - 2 * ny * ny;
          this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
          return this;
        };
        Mat3R.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[3 + i], te[6 + i]];
        };
        Mat3R.prototype.scale = function(s) {
          var m = this.elements;
          m[0] *= s;
          m[3] *= s;
          m[6] *= s;
          m[1] *= s;
          m[4] *= s;
          m[7] *= s;
          m[2] *= s;
          m[5] *= s;
          m[8] *= s;
          return this;
        };
        Mat3R.prototype.set = function(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
          var te = this.elements;
          te[0] = n11;
          te[3] = n12;
          te[6] = n13;
          te[1] = n21;
          te[4] = n22;
          te[7] = n23;
          te[2] = n31;
          te[5] = n32;
          te[8] = n33;
          return this;
        };
        Mat3R.prototype.sub = function(rhs) {
          var te = this.elements;
          var t11 = te[0];
          var t21 = te[1];
          var t31 = te[2];
          var t12 = te[3];
          var t22 = te[4];
          var t32 = te[5];
          var t13 = te[6];
          var t23 = te[7];
          var t33 = te[5];
          var re = rhs.elements;
          var r11 = re[0];
          var r21 = re[1];
          var r31 = re[2];
          var r12 = re[3];
          var r22 = re[4];
          var r32 = re[5];
          var r13 = re[6];
          var r23 = re[7];
          var r33 = re[8];
          var m11 = t11 - r11;
          var m21 = t21 - r21;
          var m31 = t31 - r31;
          var m12 = t12 - r12;
          var m22 = t22 - r22;
          var m32 = t32 - r32;
          var m13 = t13 - r13;
          var m23 = t23 - r23;
          var m33 = t33 - r33;
          return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        };
        Mat3R.prototype.toString = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat3R.prototype.translation = function(d) {
          var x = d.x;
          var y = d.y;
          return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
        };
        Mat3R.prototype.transpose = function() {
          var tmp;
          var m = this.elements;
          tmp = m[1];
          m[1] = m[3];
          m[3] = tmp;
          tmp = m[2];
          m[2] = m[6];
          m[6] = tmp;
          tmp = m[5];
          m[5] = m[7];
          m[7] = tmp;
          return this;
        };
        Mat3R.prototype.zero = function() {
          return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Mat3R.prototype.__add__ = function(rhs) {
          if (rhs instanceof Mat3R) {
            return this.clone().add(rhs);
          } else {
            return void 0;
          }
        };
        Mat3R.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Mat3R) {
            return lhs.clone().add(this);
          } else {
            return void 0;
          }
        };
        Mat3R.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Mat3R) {
            return this.clone().mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Mat3R.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Mat3R) {
            return lhs.clone().mul(this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        Mat3R.prototype.__pos__ = function() {
          return this.clone();
        };
        Mat3R.prototype.__neg__ = function() {
          return this.clone().scale(-1);
        };
        Mat3R.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Mat3R) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        Mat3R.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Mat3R) {
            return lhs.clone().sub(this);
          } else {
            return void 0;
          }
        };
        Mat3R.one = function() {
          return new Mat3R(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Mat3R.reflection = function(n) {
          return Mat3R.zero().reflection(n);
        };
        Mat3R.zero = function() {
          return new Mat3R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Mat3R;
      })(AbstractMatrix_1.default);
      exports_1("default", Mat3R);
    }
  };
});

System.register("davinci-eight/checks/mustBeDefined.js", ["../checks/mustSatisfy", "../checks/isDefined"], function(exports_1) {
  var mustSatisfy_1,
      isDefined_1;
  function beDefined() {
    return "not be 'undefined'";
  }
  function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
    return value;
  }
  exports_1("default", mustBeDefined);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isInteger.js", ["../checks/isNumber"], function(exports_1) {
  var isNumber_1;
  function isInteger(x) {
    return isNumber_1.default(x) && x % 1 === 0;
  }
  exports_1("default", isInteger);
  return {
    setters: [function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeInteger.js", ["../checks/mustSatisfy", "../checks/isInteger"], function(exports_1) {
  var mustSatisfy_1,
      isInteger_1;
  function beAnInteger() {
    return "be an integer";
  }
  function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
    return value;
  }
  exports_1("default", mustBeInteger);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isInteger_1_1) {
      isInteger_1 = isInteger_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeNumber.js", ["../core", "../checks/mustSatisfy", "../checks/isNumber"], function(exports_1) {
  var core_1,
      mustSatisfy_1,
      isNumber_1;
  function beANumber() {
    return "be a `number`";
  }
  function default_1(name, value, contextBuilder) {
    if (core_1.default.fastPath) {
      if (core_1.default.strict) {
        throw new Error("mustBeNumber must not be called on the fast path.");
      } else {
        console.warn("mustBeNumber should not be called on the fast path.");
      }
    }
    mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/expectArg.js", ["../checks/isUndefined", "../checks/mustBeNumber"], function(exports_1) {
  var isUndefined_1,
      mustBeNumber_1;
  function message(standard, override) {
    return isUndefined_1.default(override) ? standard : override();
  }
  function expectArg(name, value) {
    var arg = {
      toSatisfy: function(condition, message) {
        if (isUndefined_1.default(condition)) {
          throw new Error("condition must be specified");
        }
        if (isUndefined_1.default(message)) {
          throw new Error("message must be specified");
        }
        if (!condition) {
          throw new Error(message);
        }
        return arg;
      },
      toBeBoolean: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'boolean') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
        }
        return arg;
      },
      toBeDefined: function() {
        var typeOfValue = typeof value;
        if (typeOfValue === 'undefined') {
          var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
          throw new Error(message_1);
        }
        return arg;
      },
      toBeInClosedInterval: function(lower, upper) {
        var something = value;
        var x = something;
        mustBeNumber_1.default('x', x);
        if (x >= lower && x <= upper) {
          return arg;
        } else {
          var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
          throw new Error(message_2);
        }
      },
      toBeFunction: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'function') {
          var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
          throw new Error(message_3);
        }
        return arg;
      },
      toBeNumber: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'number') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
        }
        return arg;
      },
      toBeObject: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'object') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
        }
        return arg;
      },
      toBeString: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'string') {
          var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
          throw new Error(message_4);
        }
        return arg;
      },
      toBeUndefined: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'undefined') {
          var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
          throw new Error(message_5);
        }
        return arg;
      },
      toNotBeNull: function() {
        if (value === null) {
          var message_6 = "Expecting argument " + name + " to not be null.";
          throw new Error(message_6);
        } else {
          return arg;
        }
      },
      get value() {
        return value;
      }
    };
    return arg;
  }
  exports_1("default", expectArg);
  return {
    setters: [function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/AbstractMatrix.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg", "../i18n/readOnly"], function(exports_1) {
  var mustBeDefined_1,
      mustBeInteger_1,
      expectArg_1,
      readOnly_1;
  var AbstractMatrix;
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      AbstractMatrix = (function() {
        function AbstractMatrix(elements, dimensions) {
          this._elements = mustBeDefined_1.default('elements', elements);
          this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
          this._length = dimensions * dimensions;
          expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
          this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
          get: function() {
            if (this._elements) {
              return this._elements;
            } else if (this._callback) {
              var elements = this._callback();
              expectArg_1.default('callback()', elements).toSatisfy(elements.length === this._length, "callback() length must be " + this._length);
              return this._callback();
            } else {
              throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
            }
          },
          set: function(elements) {
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
            this._elements = elements;
            this._callback = void 0;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
          get: function() {
            return this._callback;
          },
          set: function(reactTo) {
            this._callback = reactTo;
            this._elements = void 0;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMatrix.prototype.copy = function(m) {
          this.elements.set(m.elements);
          return this;
        };
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
          get: function() {
            return this._dimensions;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('dimensions').message);
          },
          enumerable: true,
          configurable: true
        });
        return AbstractMatrix;
      })();
      exports_1("default", AbstractMatrix);
    }
  };
});

System.register("davinci-eight/math/add4x4.js", [], function(exports_1) {
  function add4x4(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x4],
        a13 = a[0x8],
        a14 = a[0xC];
    var a21 = a[0x1],
        a22 = a[0x5],
        a23 = a[0x9],
        a24 = a[0xD];
    var a31 = a[0x2],
        a32 = a[0x6],
        a33 = a[0xA],
        a34 = a[0xE];
    var a41 = a[0x3],
        a42 = a[0x7],
        a43 = a[0xB],
        a44 = a[0xF];
    var b11 = b[0x0],
        b12 = b[0x4],
        b13 = b[0x8],
        b14 = b[0xC];
    var b21 = b[0x1],
        b22 = b[0x5],
        b23 = b[0x9],
        b24 = b[0xD];
    var b31 = b[0x2],
        b32 = b[0x6],
        b33 = b[0xA],
        b34 = b[0xE];
    var b41 = b[0x3],
        b42 = b[0x7],
        b43 = b[0xB],
        b44 = b[0xF];
    c[0x0] = a11 + b11;
    c[0x4] = a12 + b12;
    c[0x8] = a13 + b13;
    c[0xC] = a14 + b14;
    c[0x1] = a21 + b21;
    c[0x5] = a22 + b22;
    c[0x9] = a23 + b23;
    c[0xD] = a24 + b24;
    c[0x2] = a31 + b31;
    c[0x6] = a32 + b32;
    c[0xA] = a33 + b33;
    c[0xE] = a34 + b34;
    c[0x3] = a41 + b41;
    c[0x7] = a42 + b42;
    c[0xB] = a43 + b43;
    c[0xF] = a44 + b44;
    return c;
  }
  exports_1("default", add4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/inv4x4.js", [], function(exports_1) {
  function inv4x4(me, te) {
    var n11 = me[0x0],
        n12 = me[0x4],
        n13 = me[0x8],
        n14 = me[0xC];
    var n21 = me[0x1],
        n22 = me[0x5],
        n23 = me[0x9],
        n24 = me[0xD];
    var n31 = me[0x2],
        n32 = me[0x6],
        n33 = me[0xA],
        n34 = me[0xE];
    var n41 = me[0x3],
        n42 = me[0x7],
        n43 = me[0xB],
        n44 = me[0xF];
    var o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    var o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    var o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    var o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    var o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    var o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    var o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    var o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    var o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    var o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    var o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    var o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    var o41 = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    var o42 = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    var o43 = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    var o44 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
    var det = n11 * o11 + n21 * o12 + n31 * o13 + n41 * o14;
    var α = 1 / det;
    te[0x0] = o11 * α;
    te[0x4] = o12 * α;
    te[0x8] = o13 * α;
    te[0xC] = o14 * α;
    te[0x1] = o21 * α;
    te[0x5] = o22 * α;
    te[0x9] = o23 * α;
    te[0xD] = o24 * α;
    te[0x2] = o31 * α;
    te[0x6] = o32 * α;
    te[0xA] = o33 * α;
    te[0xE] = o34 * α;
    te[0x3] = o41 * α;
    te[0x7] = o42 * α;
    te[0xB] = o43 * α;
    te[0xF] = o44 * α;
  }
  exports_1("default", inv4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mul4x4.js", [], function(exports_1) {
  function mul4x4(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x4],
        a13 = a[0x8],
        a14 = a[0xC];
    var a21 = a[0x1],
        a22 = a[0x5],
        a23 = a[0x9],
        a24 = a[0xD];
    var a31 = a[0x2],
        a32 = a[0x6],
        a33 = a[0xA],
        a34 = a[0xE];
    var a41 = a[0x3],
        a42 = a[0x7],
        a43 = a[0xB],
        a44 = a[0xF];
    var b11 = b[0x0],
        b12 = b[0x4],
        b13 = b[0x8],
        b14 = b[0xC];
    var b21 = b[0x1],
        b22 = b[0x5],
        b23 = b[0x9],
        b24 = b[0xD];
    var b31 = b[0x2],
        b32 = b[0x6],
        b33 = b[0xA],
        b34 = b[0xE];
    var b41 = b[0x3],
        b42 = b[0x7],
        b43 = b[0xB],
        b44 = b[0xF];
    c[0x0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    c[0x4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    c[0x8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    c[0xC] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    c[0x1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    c[0x5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    c[0x9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    c[0xD] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    c[0x2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    c[0x6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    c[0xA] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    c[0xE] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    c[0x3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    c[0x7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    c[0xB] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    c[0xF] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return c;
  }
  exports_1("default", mul4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Mat4R.js", ["../math/AbstractMatrix", "../math/add4x4", "../math/inv4x4", "../math/mul4x4"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add4x4_1,
      inv4x4_1,
      mul4x4_1;
  var Mat4R;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add4x4_1_1) {
      add4x4_1 = add4x4_1_1;
    }, function(inv4x4_1_1) {
      inv4x4_1 = inv4x4_1_1;
    }, function(mul4x4_1_1) {
      mul4x4_1 = mul4x4_1_1;
    }],
    execute: function() {
      Mat4R = (function(_super) {
        __extends(Mat4R, _super);
        function Mat4R(elements) {
          _super.call(this, elements, 4);
        }
        Mat4R.one = function() {
          return new Mat4R(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        Mat4R.zero = function() {
          return new Mat4R(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        Mat4R.scaling = function(scale) {
          return Mat4R.one().scaling(scale);
        };
        Mat4R.translation = function(vector) {
          return Mat4R.one().translation(vector);
        };
        Mat4R.rotation = function(spinor) {
          return Mat4R.one().rotation(spinor);
        };
        Mat4R.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Mat4R.prototype.add2 = function(a, b) {
          add4x4_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Mat4R.prototype.clone = function() {
          return Mat4R.zero().copy(this);
        };
        Mat4R.prototype.compose = function(scale, attitude, position) {
          this.scaling(scale);
          this.rotate(attitude);
          this.translate(position);
          return this;
        };
        Mat4R.prototype.copy = function(m) {
          this.elements.set(m.elements);
          return this;
        };
        Mat4R.prototype.det = function() {
          var te = this.elements;
          var n11 = te[0],
              n12 = te[4],
              n13 = te[8],
              n14 = te[12];
          var n21 = te[1],
              n22 = te[5],
              n23 = te[9],
              n24 = te[13];
          var n31 = te[2],
              n32 = te[6],
              n33 = te[10],
              n34 = te[14];
          var n41 = te[3],
              n42 = te[7],
              n43 = te[11],
              n44 = te[15];
          var n1122 = n11 * n22;
          var n1123 = n11 * n23;
          var n1124 = n11 * n24;
          var n1221 = n12 * n21;
          var n1223 = n12 * n23;
          var n1224 = n12 * n24;
          var n1321 = n13 * n21;
          var n1322 = n13 * n22;
          var n1324 = n13 * n24;
          var n1421 = n14 * n21;
          var n1422 = n14 * n22;
          var n1423 = n14 * n23;
          return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) + n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) + n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) + n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
        };
        Mat4R.prototype.inv = function() {
          inv4x4_1.default(this.elements, this.elements);
          return this;
        };
        Mat4R.prototype.invert = function(m) {
          inv4x4_1.default(m.elements, this.elements);
          return this;
        };
        Mat4R.prototype.one = function() {
          return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.scale = function(s) {
          var te = this.elements;
          te[0] *= s;
          te[4] *= s;
          te[8] *= s;
          te[12] *= s;
          te[1] *= s;
          te[5] *= s;
          te[9] *= s;
          te[13] *= s;
          te[2] *= s;
          te[6] *= s;
          te[10] *= s;
          te[14] *= s;
          te[3] *= s;
          te[7] *= s;
          te[11] *= s;
          te[15] *= s;
          return this;
        };
        Mat4R.prototype.transpose = function() {
          var te = this.elements;
          var tmp;
          tmp = te[1];
          te[1] = te[4];
          te[4] = tmp;
          tmp = te[2];
          te[2] = te[8];
          te[8] = tmp;
          tmp = te[6];
          te[6] = te[9];
          te[9] = tmp;
          tmp = te[3];
          te[3] = te[12];
          te[12] = tmp;
          tmp = te[7];
          te[7] = te[13];
          te[13] = tmp;
          tmp = te[11];
          te[11] = te[14];
          te[14] = tmp;
          return this;
        };
        Mat4R.prototype.frustum = function(left, right, bottom, top, near, far) {
          var te = this.elements;
          var x = 2 * near / (right - left);
          var y = 2 * near / (top - bottom);
          var a = (right + left) / (right - left);
          var b = (top + bottom) / (top - bottom);
          var c = -(far + near) / (far - near);
          var d = -2 * far * near / (far - near);
          te[0] = x;
          te[4] = 0;
          te[8] = a;
          te[12] = 0;
          te[1] = 0;
          te[5] = y;
          te[9] = b;
          te[13] = 0;
          te[2] = 0;
          te[6] = 0;
          te[10] = c;
          te[14] = d;
          te[3] = 0;
          te[7] = 0;
          te[11] = -1;
          te[15] = 0;
          return this;
        };
        Mat4R.prototype.rotationAxis = function(axis, angle) {
          var c = Math.cos(angle);
          var s = Math.sin(angle);
          var t = 1 - c;
          var x = axis.x,
              y = axis.y,
              z = axis.z;
          var tx = t * x,
              ty = t * y;
          return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Mat4R.prototype.mul2 = function(a, b) {
          mul4x4_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Mat4R.prototype.rmul = function(lhs) {
          return this.mul2(lhs, this);
        };
        Mat4R.prototype.reflection = function(n) {
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var aa = -2 * nx * ny;
          var cc = -2 * ny * nz;
          var bb = -2 * nz * nx;
          var xx = 1 - 2 * nx * nx;
          var yy = 1 - 2 * ny * ny;
          var zz = 1 - 2 * nz * nz;
          this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
          return this;
        };
        Mat4R.prototype.rotate = function(spinor) {
          return this.rmul(Mat4R.rotation(spinor));
        };
        Mat4R.prototype.rotation = function(spinor) {
          var x = -spinor.yz;
          var y = -spinor.zx;
          var z = -spinor.xy;
          var α = spinor.α;
          var x2 = x + x;
          var y2 = y + y;
          var z2 = z + z;
          var xx = x * x2;
          var xy = x * y2;
          var xz = x * z2;
          var yy = y * y2;
          var yz = y * z2;
          var zz = z * z2;
          var wx = α * x2;
          var wy = α * y2;
          var wz = α * z2;
          this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
          return this;
        };
        Mat4R.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        Mat4R.prototype.scaleXYZ = function(scale) {
          return this.rmul(Mat4R.scaling(scale));
        };
        Mat4R.prototype.scaling = function(scale) {
          return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        Mat4R.prototype.set = function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
          var te = this.elements;
          te[0x0] = n11;
          te[0x4] = n12;
          te[0x8] = n13;
          te[0xC] = n14;
          te[0x1] = n21;
          te[0x5] = n22;
          te[0x9] = n23;
          te[0xD] = n24;
          te[0x2] = n31;
          te[0x6] = n32;
          te[0xA] = n33;
          te[0xE] = n34;
          te[0x3] = n41;
          te[0x7] = n42;
          te[0xB] = n43;
          te[0xF] = n44;
          return this;
        };
        Mat4R.prototype.toFixed = function(digits) {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toFixed(digits);
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat4R.prototype.toString = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Mat4R.prototype.translate = function(d) {
          return this.rmul(Mat4R.translation(d));
        };
        Mat4R.prototype.translation = function(d) {
          var x = d.x;
          var y = d.y;
          var z = d.z;
          return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        };
        Mat4R.prototype.zero = function() {
          return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Mat4R.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Mat4R) {
            return Mat4R.one().mul2(this, rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Mat4R.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Mat4R) {
            return Mat4R.one().mul2(lhs, this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        return Mat4R;
      })(AbstractMatrix_1.default);
      exports_1("default", Mat4R);
    }
  };
});

System.register("davinci-eight/checks/isNumber.js", [], function(exports_1) {
  function isNumber(x) {
    return (typeof x === 'number');
  }
  exports_1("default", isNumber);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isArray.js", [], function(exports_1) {
  function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  }
  exports_1("default", isArray);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeArray.js", ["../core", "../checks/mustSatisfy", "../checks/isArray"], function(exports_1) {
  var core_1,
      mustSatisfy_1,
      isArray_1;
  function beAnArray() {
    return "be an array";
  }
  function default_1(name, value, contextBuilder) {
    if (core_1.default.fastPath) {
      if (core_1.default.strict) {
        throw new Error("mustBeArray must not be called on the fast path.");
      } else {
        console.warn("mustBeArray should not be called on the fast path.");
      }
    }
    mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isArray_1_1) {
      isArray_1 = isArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/stringFromCoordinates.js", ["../checks/isDefined", "../checks/mustBeArray"], function(exports_1) {
  var isDefined_1,
      mustBeArray_1;
  function isLabelOne(label) {
    if (typeof label === 'string') {
      return label === "1";
    } else {
      var labels = mustBeArray_1.default('label', label);
      if (labels.length === 2) {
        return isLabelOne(labels[0]) && isLabelOne(labels[1]);
      } else if (labels.length === 1) {
        return isLabelOne(labels[0]);
      } else {
        return false;
      }
    }
  }
  function appendLabel(coord, label, sb) {
    if (typeof label === 'string') {
      sb.push(label);
    } else {
      var labels = mustBeArray_1.default('label', label);
      if (labels.length === 2) {
        sb.push(coord > 0 ? labels[1] : labels[0]);
      } else if (labels.length === 1) {
        sb.push(labels[0]);
      } else if (labels.length === 0) {} else {
        throw new Error("Unexpected basis label array length: " + labels.length);
      }
    }
  }
  function appendCoord(coord, numberToString, label, sb) {
    if (coord !== 0) {
      if (coord >= 0) {
        if (sb.length > 0) {
          sb.push("+");
        }
      } else {
        if (typeof label === 'string') {
          sb.push("-");
        } else {
          var labels = mustBeArray_1.default('label', label);
          if (labels.length === 2) {
            if (labels[0] !== labels[1]) {
              if (sb.length > 0) {
                sb.push("+");
              }
            } else {
              sb.push("-");
            }
          } else if (labels.length === 1) {
            sb.push("-");
          } else {
            sb.push("-");
          }
        }
      }
      var n = Math.abs(coord);
      if (n === 1) {
        appendLabel(coord, label, sb);
      } else {
        sb.push(numberToString(n));
        if (!isLabelOne(label)) {
          sb.push("*");
          appendLabel(coord, label, sb);
        } else {}
      }
    } else {}
  }
  function stringFromCoordinates(coordinates, numberToString, labels) {
    var sb = [];
    for (var i = 0,
        iLength = coordinates.length; i < iLength; i++) {
      var coord = coordinates[i];
      if (isDefined_1.default(coord)) {
        appendCoord(coord, numberToString, labels[i], sb);
      } else {
        return void 0;
      }
    }
    return sb.length > 0 ? sb.join("") : "0";
  }
  exports_1("default", stringFromCoordinates);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/toStringCustom.js", ["../math/stringFromCoordinates"], function(exports_1) {
  var stringFromCoordinates_1;
  function toStringCustom(coordinates, uom, coordToString, labels) {
    var quantityString = stringFromCoordinates_1.default(coordinates, coordToString, labels);
    if (uom) {
      var unitString = uom.toString().trim();
      if (unitString) {
        return quantityString + ' ' + unitString;
      } else {
        return quantityString;
      }
    } else {
      return quantityString;
    }
  }
  exports_1("default", toStringCustom);
  return {
    setters: [function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isDefined.js", [], function(exports_1) {
  function isDefined(arg) {
    return (typeof arg !== 'undefined');
  }
  exports_1("default", isDefined);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isUndefined.js", [], function(exports_1) {
  function isUndefined(arg) {
    return (typeof arg === 'undefined');
  }
  exports_1("default", isUndefined);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/VectorN.js", ["../checks/isDefined", "../checks/isUndefined"], function(exports_1) {
  var isDefined_1,
      isUndefined_1;
  var VectorN;
  function pushString(T) {
    return "push(value: " + T + "): number";
  }
  function popString(T) {
    return "pop(): " + T;
  }
  function verboten(operation) {
    return operation + " is not allowed for a fixed size vector";
  }
  function verbotenPush() {
    return verboten(pushString('T'));
  }
  function verbotenPop() {
    return verboten(popString('T'));
  }
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }],
    execute: function() {
      VectorN = (function() {
        function VectorN(data, modified, size) {
          if (modified === void 0) {
            modified = false;
          }
          this.modified = modified;
          if (isDefined_1.default(size)) {
            this._size = size;
            this._data = data;
          } else {
            this._size = void 0;
            this._data = data;
          }
        }
        Object.defineProperty(VectorN.prototype, "coords", {
          get: function() {
            if (this._data) {
              return this._data;
            } else if (this._callback) {
              return this._callback();
            } else {
              throw new Error("Vector" + this._size + " is undefined.");
            }
          },
          set: function(data) {
            this._data = data;
            this._callback = void 0;
            this.modified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(VectorN.prototype, "callback", {
          get: function() {
            return this._callback;
          },
          set: function(reactTo) {
            this._callback = reactTo;
            this._data = void 0;
            this.modified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
          get: function() {
            return this.coords.length;
          },
          enumerable: true,
          configurable: true
        });
        VectorN.prototype.clone = function() {
          return new VectorN(this._data, this.modified, this._size);
        };
        VectorN.prototype.getComponent = function(index) {
          return this.coords[index];
        };
        VectorN.prototype.pop = function() {
          if (isUndefined_1.default(this._size)) {
            return this.coords.pop();
          } else {
            throw new Error(verbotenPop());
          }
        };
        VectorN.prototype.push = function(value) {
          if (isUndefined_1.default(this._size)) {
            var data = this.coords;
            var newLength = data.push(value);
            this.coords = data;
            return newLength;
          } else {
            throw new Error(verbotenPush());
          }
        };
        VectorN.prototype.setComponent = function(index, value) {
          var coords = this.coords;
          var previous = coords[index];
          if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified = true;
          }
        };
        VectorN.prototype.toArray = function(array, offset) {
          if (array === void 0) {
            array = [];
          }
          if (offset === void 0) {
            offset = 0;
          }
          var data = this.coords;
          var length = data.length;
          for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
          }
          return array;
        };
        VectorN.prototype.toLocaleString = function() {
          return this.coords.toLocaleString();
        };
        VectorN.prototype.toString = function() {
          return this.coords.toString();
        };
        return VectorN;
      })();
      exports_1("default", VectorN);
    }
  };
});

System.register("davinci-eight/math/wedgeXY.js", [], function(exports_1) {
  function wedgeXY(ax, ay, az, bx, by, bz) {
    return ax * by - ay * bx;
  }
  exports_1("default", wedgeXY);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/wedgeYZ.js", [], function(exports_1) {
  function wedgeYZ(ax, ay, az, bx, by, bz) {
    return ay * bz - az * by;
  }
  exports_1("default", wedgeYZ);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/wedgeZX.js", [], function(exports_1) {
  function wedgeZX(ax, ay, az, bx, by, bz) {
    return az * bx - ax * bz;
  }
  exports_1("default", wedgeZX);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/R3.js", ["../math/dotVectorE3", "../math/Euclidean3", "../math/Mat3R", "../math/Mat4R", "../checks/isDefined", "../checks/isNumber", "../math/toStringCustom", "../math/VectorN", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorE3_1,
      Euclidean3_1,
      Mat3R_1,
      Mat4R_1,
      isDefined_1,
      isNumber_1,
      toStringCustom_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var sqrt,
      COORD_X,
      COORD_Y,
      COORD_Z,
      BASIS_LABELS,
      R3;
  function coordinates(m) {
    return [m.x, m.y, m.z];
  }
  return {
    setters: [function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(Mat3R_1_1) {
      Mat3R_1 = Mat3R_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }, function(toStringCustom_1_1) {
      toStringCustom_1 = toStringCustom_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      sqrt = Math.sqrt;
      COORD_X = 0;
      COORD_Y = 1;
      COORD_Z = 2;
      BASIS_LABELS = ['e1', 'e2', 'e3'];
      R3 = (function(_super) {
        __extends(R3, _super);
        function R3(data, modified) {
          if (data === void 0) {
            data = [0, 0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 3);
        }
        R3.dot = function(a, b) {
          return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(R3.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R3.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[COORD_Y] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R3.prototype, "z", {
          get: function() {
            return this.coords[COORD_Z];
          },
          set: function(value) {
            this.modified = this.modified || this.z !== value;
            this.coords[COORD_Z] = value;
          },
          enumerable: true,
          configurable: true
        });
        R3.prototype.add = function(vector, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += vector.x * α;
          this.y += vector.y * α;
          this.z += vector.z * α;
          return this;
        };
        R3.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        };
        R3.prototype.applyMatrix = function(m) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
          this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
          this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
          return this;
        };
        R3.prototype.applyMatrix4 = function(m) {
          var x = this.x,
              y = this.y,
              z = this.z;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
          this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
          this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
          return this;
        };
        R3.prototype.reflect = function(n) {
          var ax = this.x;
          var ay = this.y;
          var az = this.z;
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var dot2 = (ax * nx + ay * ny + az * nz) * 2;
          this.x = ax - dot2 * nx;
          this.y = ay - dot2 * ny;
          this.z = az - dot2 * nz;
          return this;
        };
        R3.prototype.rotate = function(R) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var a = R.xy;
          var b = R.yz;
          var c = R.zx;
          var w = R.α;
          var ix = w * x - c * z + a * y;
          var iy = w * y - a * x + b * z;
          var iz = w * z - b * y + c * x;
          var iw = b * x + c * y + a * z;
          this.x = ix * w + iw * b + iy * a - iz * c;
          this.y = iy * w + iw * c + iz * b - ix * a;
          this.z = iz * w + iw * a + ix * c - iy * b;
          return this;
        };
        R3.prototype.clone = function() {
          return new R3([this.x, this.y, this.z]);
        };
        R3.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        };
        R3.prototype.copyCoordinates = function(coordinates) {
          this.x = coordinates[COORD_X];
          this.y = coordinates[COORD_Y];
          this.z = coordinates[COORD_Z];
          return this;
        };
        R3.prototype.cross = function(v) {
          return this.cross2(this, v);
        };
        R3.prototype.cross2 = function(a, b) {
          var ax = a.x,
              ay = a.y,
              az = a.z;
          var bx = b.x,
              by = b.y,
              bz = b.z;
          this.x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        R3.prototype.distanceTo = function(point) {
          if (isDefined_1.default(point)) {
            return sqrt(this.quadranceTo(point));
          } else {
            return void 0;
          }
        };
        R3.prototype.quadranceTo = function(point) {
          if (isDefined_1.default(point)) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
          } else {
            return void 0;
          }
        };
        R3.prototype.divByScalar = function(α) {
          if (α !== 0) {
            var invScalar = 1 / α;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
          } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
          }
          return this;
        };
        R3.prototype.dot = function(v) {
          return R3.dot(this, v);
        };
        R3.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        R3.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        };
        R3.prototype.lerp = function(target, α) {
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          return this;
        };
        R3.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        R3.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        R3.prototype.scale = function(α) {
          this.x *= α;
          this.y *= α;
          this.z *= α;
          return this;
        };
        R3.prototype.setXYZ = function(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        };
        R3.prototype.setY = function(y) {
          this.y = y;
          return this;
        };
        R3.prototype.slerp = function(target, α) {
          return this;
        };
        R3.prototype.squaredNorm = function() {
          return dotVectorE3_1.default(this, this);
        };
        R3.prototype.sub = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x -= v.x * α;
          this.y -= v.y * α;
          this.z -= v.z * α;
          return this;
        };
        R3.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        };
        R3.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        R3.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          return this;
        };
        R3.prototype.__add__ = function(rhs) {
          if (rhs instanceof R3) {
            return this.clone().add(rhs, 1.0);
          } else {
            return void 0;
          }
        };
        R3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof R3) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        R3.prototype.__mul__ = function(rhs) {
          if (isNumber_1.default(rhs)) {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        R3.prototype.__rmul__ = function(lhs) {
          if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else if (lhs instanceof Mat3R_1.default) {
            var m33 = lhs;
            return this.clone().applyMatrix(m33);
          } else if (lhs instanceof Mat4R_1.default) {
            var m44 = lhs;
            return this.clone().applyMatrix4(m44);
          } else {
            return void 0;
          }
        };
        R3.copy = function(vector) {
          return new R3([vector.x, vector.y, vector.z]);
        };
        R3.lerp = function(a, b, α) {
          return R3.copy(b).sub(a).scale(α).add(a);
        };
        R3.random = function() {
          return new R3([Math.random(), Math.random(), Math.random()]);
        };
        R3.e1 = Euclidean3_1.default.e1;
        R3.e2 = Euclidean3_1.default.e2;
        R3.e3 = Euclidean3_1.default.e3;
        return R3;
      })(VectorN_1.default);
      exports_1("default", R3);
    }
  };
});

System.register("davinci-eight/core.js", [], function(exports_1) {
  var Eight,
      core;
  return {
    setters: [],
    execute: function() {
      Eight = (function() {
        function Eight() {
          this.fastPath = false;
          this.strict = false;
          this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
          this.LAST_MODIFIED = '2016-02-03';
          this.NAMESPACE = 'EIGHT';
          this.verbose = false;
          this.VERSION = '2.176.0';
          this.logging = {};
        }
        return Eight;
      })();
      core = new Eight();
      exports_1("default", core);
    }
  };
});

System.register("davinci-eight/checks/mustSatisfy.js", [], function(exports_1) {
  function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
    if (!condition) {
      var message = messageBuilder ? messageBuilder() : "satisfy some condition";
      var context = contextBuilder ? " in " + contextBuilder() : "";
      throw new Error(name + " must " + message + context + ".");
    }
  }
  exports_1("default", mustSatisfy);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isString.js", [], function(exports_1) {
  function isString(s) {
    return (typeof s === 'string');
  }
  exports_1("default", isString);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeString.js", ["../core", "../checks/mustSatisfy", "../checks/isString"], function(exports_1) {
  var core_1,
      mustSatisfy_1,
      isString_1;
  function beAString() {
    return "be a string";
  }
  function default_1(name, value, contextBuilder) {
    if (core_1.default.fastPath) {
      if (core_1.default.strict) {
        throw new Error("mustBeString must not be called on the fast path.");
      } else {
        console.warn("mustBeString should not be called on the fast path.");
      }
    }
    mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isString_1_1) {
      isString_1 = isString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/i18n/readOnly.js", ["../checks/mustBeString"], function(exports_1) {
  var mustBeString_1;
  function readOnly(name) {
    mustBeString_1.default('name', name);
    var message = {get message() {
        return "Property `" + name + "` is readonly.";
      }};
    return message;
  }
  exports_1("default", readOnly);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/GraphicsProgramSymbols.js", [], function(exports_1) {
  var GraphicsProgramSymbols;
  return {
    setters: [],
    execute: function() {
      GraphicsProgramSymbols = (function() {
        function GraphicsProgramSymbols() {}
        GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
        GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
        GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
        GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
        GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
        GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
        GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
        GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
        GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
        GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
        return GraphicsProgramSymbols;
      })();
      exports_1("default", GraphicsProgramSymbols);
    }
  };
});

System.register("davinci-eight/facets/ModelFacet.js", ["../math/Mat3R", "../math/Mat4R", "../models/ModelE3", "../checks/mustBeArray", "../checks/mustBeString", "../math/R3", "../i18n/readOnly", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Mat3R_1,
      Mat4R_1,
      ModelE3_1,
      mustBeArray_1,
      mustBeString_1,
      R3_1,
      readOnly_1,
      GraphicsProgramSymbols_1;
  var ModelFacet;
  return {
    setters: [function(Mat3R_1_1) {
      Mat3R_1 = Mat3R_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(ModelE3_1_1) {
      ModelE3_1 = ModelE3_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      ModelFacet = (function(_super) {
        __extends(ModelFacet, _super);
        function ModelFacet(type) {
          if (type === void 0) {
            type = 'ModelFacet';
          }
          _super.call(this, mustBeString_1.default('type', type));
          this._scaleXYZ = new R3_1.default([1, 1, 1]);
          this.matM = Mat4R_1.default.one();
          this.matN = Mat3R_1.default.one();
          this.matR = Mat4R_1.default.one();
          this.matS = Mat4R_1.default.one();
          this.matT = Mat4R_1.default.one();
          this._scaleXYZ.modified = true;
        }
        ModelFacet.prototype.destructor = function() {
          this._scaleXYZ = void 0;
          this.matM = void 0;
          this.matN = void 0;
          this.matR = void 0;
          this.matS = void 0;
          this.matT = void 0;
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(ModelFacet.prototype, "scaleXYZ", {
          get: function() {
            return this._scaleXYZ;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelFacet.PROP_SCALEXYZ).message);
          },
          enumerable: true,
          configurable: true
        });
        ModelFacet.prototype.setUniforms = function(visitor) {
          if (this.X.modified) {
            this.matT.translation(this.X);
            this.X.modified = false;
          }
          if (this.R.modified) {
            this.matR.rotation(this.R);
            this.R.modified = false;
          }
          if (this.scaleXYZ.modified) {
            this.matS.scaling(this.scaleXYZ);
            this.scaleXYZ.modified = false;
          }
          this.matM.copy(this.matT).mul(this.matR).mul(this.matS);
          this.matN.normalFromMat4R(this.matM);
          visitor.mat4(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, this.matM, false);
          visitor.mat3(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, this.matN, false);
        };
        ModelFacet.prototype.setProperty = function(name, data) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('data', data);
          _super.prototype.setProperty.call(this, name, data);
          return this;
        };
        ModelFacet.PROP_SCALEXYZ = 'scaleXYZ';
        return ModelFacet;
      })(ModelE3_1.default);
      exports_1("default", ModelFacet);
    }
  };
});

System.register("davinci-eight/visual/RigidBody.js", ["../scene/Composite", "../facets/ColorFacet", "../facets/ModelFacet"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Composite_1,
      ColorFacet_1,
      ModelFacet_1;
  var COLOR_FACET_NAME,
      MODEL_FACET_NAME,
      RigidBody;
  return {
    setters: [function(Composite_1_1) {
      Composite_1 = Composite_1_1;
    }, function(ColorFacet_1_1) {
      ColorFacet_1 = ColorFacet_1_1;
    }, function(ModelFacet_1_1) {
      ModelFacet_1 = ModelFacet_1_1;
    }],
    execute: function() {
      COLOR_FACET_NAME = 'color';
      MODEL_FACET_NAME = 'model';
      RigidBody = (function(_super) {
        __extends(RigidBody, _super);
        function RigidBody(buffers, program, type) {
          _super.call(this, buffers, program, type);
          var modelFacet = new ModelFacet_1.default();
          this.setFacet(MODEL_FACET_NAME, modelFacet);
          modelFacet.release();
          var colorFacet = new ColorFacet_1.default();
          this.setFacet(COLOR_FACET_NAME, colorFacet);
          colorFacet.release();
        }
        RigidBody.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(RigidBody.prototype, "color", {
          get: function() {
            var facet = this.getFacet(COLOR_FACET_NAME);
            var color = facet.color;
            facet.release();
            return color;
          },
          set: function(color) {
            var facet = this.getFacet(COLOR_FACET_NAME);
            facet.color.copy(color);
            facet.release();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "R", {
          get: function() {
            var model = this.getFacet(MODEL_FACET_NAME);
            var R = model.R;
            model.release();
            return R;
          },
          set: function(R) {
            var model = this.getFacet(MODEL_FACET_NAME);
            model.R.copy(R);
            model.release();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "X", {
          get: function() {
            var model = this.getFacet(MODEL_FACET_NAME);
            var X = model.X;
            model.release();
            return X;
          },
          set: function(X) {
            var model = this.getFacet(MODEL_FACET_NAME);
            model.X.copyVector(X);
            model.release();
          },
          enumerable: true,
          configurable: true
        });
        return RigidBody;
      })(Composite_1.default);
      exports_1("default", RigidBody);
    }
  };
});

System.register("davinci-eight/visual/Ball.js", ["../checks/mustBeNumber", "./visualCache", "./RigidBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeNumber_1,
      visualCache_1,
      RigidBody_1;
  var MODEL_FACET_NAME,
      currentSphere,
      currentProgram,
      Ball;
  function sphere() {
    currentSphere = visualCache_1.default.sphere();
    return currentSphere;
  }
  function program() {
    currentProgram = visualCache_1.default.program();
    return currentProgram;
  }
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(RigidBody_1_1) {
      RigidBody_1 = RigidBody_1_1;
    }],
    execute: function() {
      MODEL_FACET_NAME = 'model';
      currentSphere = void 0;
      currentProgram = void 0;
      Ball = (function(_super) {
        __extends(Ball, _super);
        function Ball() {
          _super.call(this, sphere(), program(), 'Ball');
          currentSphere.release();
          currentSphere = void 0;
          currentProgram.release();
          currentProgram = void 0;
        }
        Ball.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Ball.prototype, "radius", {
          get: function() {
            var model = this.getFacet(MODEL_FACET_NAME);
            var radius = model.scaleXYZ.x;
            model.release();
            return radius;
          },
          set: function(radius) {
            mustBeNumber_1.default('radius', radius);
            var model = this.getFacet(MODEL_FACET_NAME);
            model.scaleXYZ.x = radius;
            model.scaleXYZ.y = radius;
            model.scaleXYZ.z = radius;
            model.release();
          },
          enumerable: true,
          configurable: true
        });
        return Ball;
      })(RigidBody_1.default);
      exports_1("default", Ball);
    }
  };
});

System.register("davinci-eight.js", ["davinci-eight/slideshow/Slide", "davinci-eight/slideshow/Director", "davinci-eight/slideshow/DirectorKeyboardHandler", "davinci-eight/slideshow/animations/WaitAnimation", "davinci-eight/slideshow/animations/ColorAnimation", "davinci-eight/slideshow/animations/Vector2Animation", "davinci-eight/slideshow/animations/Vector3Animation", "davinci-eight/slideshow/animations/Spinor2Animation", "davinci-eight/slideshow/animations/Spinor3Animation", "davinci-eight/cameras/createFrustum", "davinci-eight/cameras/createPerspective", "davinci-eight/cameras/createView", "davinci-eight/cameras/frustumMatrix", "davinci-eight/cameras/PerspectiveCamera", "davinci-eight/cameras/perspectiveMatrix", "davinci-eight/cameras/viewMatrix", "davinci-eight/commands/BlendFactor", "davinci-eight/commands/WebGLBlendFunc", "davinci-eight/commands/WebGLClearColor", "davinci-eight/commands/Capability", "davinci-eight/commands/WebGLDisable", "davinci-eight/commands/WebGLEnable", "davinci-eight/core/AttribLocation", "davinci-eight/core/Color", "davinci-eight/core", "davinci-eight/core/DrawMode", "davinci-eight/core/GraphicsProgramSymbols", "davinci-eight/core/UniformLocation", "davinci-eight/curves/Curve", "davinci-eight/devices/Keyboard", "davinci-eight/geometries/DrawAttribute", "davinci-eight/geometries/DrawPrimitive", "davinci-eight/geometries/Simplex", "davinci-eight/geometries/Vertex", "davinci-eight/geometries/simplicesToGeometryMeta", "davinci-eight/geometries/computeFaceNormals", "davinci-eight/geometries/cube", "davinci-eight/geometries/quadrilateral", "davinci-eight/geometries/square", "davinci-eight/geometries/tetrahedron", "davinci-eight/geometries/simplicesToDrawPrimitive", "davinci-eight/geometries/triangle", "davinci-eight/topologies/Topology", "davinci-eight/topologies/PointTopology", "davinci-eight/topologies/LineTopology", "davinci-eight/topologies/MeshTopology", "davinci-eight/topologies/GridTopology", "davinci-eight/scene/Composite", "davinci-eight/scene/Scene", "davinci-eight/scene/WebGLRenderer", "davinci-eight/geometries/AxialSimplexGeometry", "davinci-eight/geometries/ArrowGeometry", "davinci-eight/geometries/BarnSimplexGeometry", "davinci-eight/geometries/ConeGeometry", "davinci-eight/geometries/ConeSimplexGeometry", "davinci-eight/geometries/CuboidGeometry", "davinci-eight/geometries/CuboidSimplexGeometry", "davinci-eight/geometries/CylinderGeometry", "davinci-eight/geometries/CylinderSimplexGeometry", "davinci-eight/geometries/DodecahedronSimplexGeometry", "davinci-eight/geometries/IcosahedronSimplexGeometry", "davinci-eight/geometries/KleinBottleSimplexGeometry", "davinci-eight/geometries/Simplex1Geometry", "davinci-eight/geometries/MobiusStripSimplexGeometry", "davinci-eight/geometries/OctahedronSimplexGeometry", "davinci-eight/geometries/SliceSimplexGeometry", "davinci-eight/geometries/GridSimplexGeometry", "davinci-eight/geometries/PolyhedronSimplexGeometry", "davinci-eight/geometries/RevolutionSimplexGeometry", "davinci-eight/geometries/RingGeometry", "davinci-eight/geometries/RingSimplexGeometry", "davinci-eight/geometries/SphereGeometry", "davinci-eight/geometries/TetrahedronSimplexGeometry", "davinci-eight/geometries/VortexSimplexGeometry", "davinci-eight/programs/smartProgram", "davinci-eight/programs/programFromScripts", "davinci-eight/materials/HTMLScriptsGraphicsProgram", "davinci-eight/materials/LineMaterial", "davinci-eight/materials/MeshMaterial", "davinci-eight/materials/MeshLambertMaterial", "davinci-eight/materials/PointMaterial", "davinci-eight/materials/GraphicsProgramBuilder", "davinci-eight/math/Dimensions", "davinci-eight/math/Euclidean2", "davinci-eight/math/Euclidean3", "davinci-eight/math/mathcore", "davinci-eight/math/R1", "davinci-eight/math/Mat2R", "davinci-eight/math/Mat3R", "davinci-eight/math/Mat4R", "davinci-eight/math/QQ", "davinci-eight/math/Unit", "davinci-eight/math/G2", "davinci-eight/math/G3", "davinci-eight/math/SpinG2", "davinci-eight/math/SpinG3", "davinci-eight/math/R2", "davinci-eight/math/R3", "davinci-eight/math/R4", "davinci-eight/math/VectorN", "davinci-eight/facets/AmbientLight", "davinci-eight/facets/ColorFacet", "davinci-eight/facets/DirectionalLight", "davinci-eight/facets/EulerFacet", "davinci-eight/facets/ModelFacet", "davinci-eight/facets/PointSizeFacet", "davinci-eight/facets/ReflectionFacetE2", "davinci-eight/facets/ReflectionFacetE3", "davinci-eight/facets/Vector3Facet", "davinci-eight/models/ModelE2", "davinci-eight/models/ModelE3", "davinci-eight/scene/GraphicsBuffers", "davinci-eight/scene/initWebGL", "davinci-eight/utils/getCanvasElementById", "davinci-eight/collections/IUnknownArray", "davinci-eight/collections/NumberIUnknownMap", "davinci-eight/core/refChange", "davinci-eight/core/Shareable", "davinci-eight/collections/StringIUnknownMap", "davinci-eight/utils/animation", "davinci-eight/visual/vector", "davinci-eight/visual/RigidBody", "davinci-eight/visual/Ball"], function(exports_1) {
  var Slide_1,
      Director_1,
      DirectorKeyboardHandler_1,
      WaitAnimation_1,
      ColorAnimation_1,
      Vector2Animation_1,
      Vector3Animation_1,
      Spinor2Animation_1,
      Spinor3Animation_1,
      createFrustum_1,
      createPerspective_1,
      createView_1,
      frustumMatrix_1,
      PerspectiveCamera_1,
      perspectiveMatrix_1,
      viewMatrix_1,
      BlendFactor_1,
      WebGLBlendFunc_1,
      WebGLClearColor_1,
      Capability_1,
      WebGLDisable_1,
      WebGLEnable_1,
      AttribLocation_1,
      Color_1,
      core_1,
      DrawMode_1,
      GraphicsProgramSymbols_1,
      UniformLocation_1,
      Curve_1,
      Keyboard_1,
      DrawAttribute_1,
      DrawPrimitive_1,
      Simplex_1,
      Vertex_1,
      simplicesToGeometryMeta_1,
      computeFaceNormals_1,
      cube_1,
      quadrilateral_1,
      square_1,
      tetrahedron_1,
      simplicesToDrawPrimitive_1,
      triangle_1,
      Topology_1,
      PointTopology_1,
      LineTopology_1,
      MeshTopology_1,
      GridTopology_1,
      Composite_1,
      Scene_1,
      WebGLRenderer_1,
      AxialSimplexGeometry_1,
      ArrowGeometry_1,
      BarnSimplexGeometry_1,
      ConeGeometry_1,
      ConeSimplexGeometry_1,
      CuboidGeometry_1,
      CuboidSimplexGeometry_1,
      CylinderGeometry_1,
      CylinderSimplexGeometry_1,
      DodecahedronSimplexGeometry_1,
      IcosahedronSimplexGeometry_1,
      KleinBottleSimplexGeometry_1,
      Simplex1Geometry_1,
      MobiusStripSimplexGeometry_1,
      OctahedronSimplexGeometry_1,
      SliceSimplexGeometry_1,
      GridSimplexGeometry_1,
      PolyhedronSimplexGeometry_1,
      RevolutionSimplexGeometry_1,
      RingGeometry_1,
      RingSimplexGeometry_1,
      SphereGeometry_1,
      TetrahedronSimplexGeometry_1,
      VortexSimplexGeometry_1,
      smartProgram_1,
      programFromScripts_1,
      HTMLScriptsGraphicsProgram_1,
      LineMaterial_1,
      MeshMaterial_1,
      MeshLambertMaterial_1,
      PointMaterial_1,
      GraphicsProgramBuilder_1,
      Dimensions_1,
      Euclidean2_1,
      Euclidean3_1,
      mathcore_1,
      R1_1,
      Mat2R_1,
      Mat3R_1,
      Mat4R_1,
      QQ_1,
      Unit_1,
      G2_1,
      G3_1,
      SpinG2_1,
      SpinG3_1,
      R2_1,
      R3_1,
      R4_1,
      VectorN_1,
      AmbientLight_1,
      ColorFacet_1,
      DirectionalLight_1,
      EulerFacet_1,
      ModelFacet_1,
      PointSizeFacet_1,
      ReflectionFacetE2_1,
      ReflectionFacetE3_1,
      Vector3Facet_1,
      ModelE2_1,
      ModelE3_1,
      GraphicsBuffers_1,
      initWebGL_1,
      getCanvasElementById_1,
      IUnknownArray_1,
      NumberIUnknownMap_1,
      refChange_1,
      Shareable_1,
      StringIUnknownMap_1,
      animation_1,
      vector_1,
      RigidBody_1,
      Ball_1;
  var eight;
  return {
    setters: [function(Slide_1_1) {
      Slide_1 = Slide_1_1;
    }, function(Director_1_1) {
      Director_1 = Director_1_1;
    }, function(DirectorKeyboardHandler_1_1) {
      DirectorKeyboardHandler_1 = DirectorKeyboardHandler_1_1;
    }, function(WaitAnimation_1_1) {
      WaitAnimation_1 = WaitAnimation_1_1;
    }, function(ColorAnimation_1_1) {
      ColorAnimation_1 = ColorAnimation_1_1;
    }, function(Vector2Animation_1_1) {
      Vector2Animation_1 = Vector2Animation_1_1;
    }, function(Vector3Animation_1_1) {
      Vector3Animation_1 = Vector3Animation_1_1;
    }, function(Spinor2Animation_1_1) {
      Spinor2Animation_1 = Spinor2Animation_1_1;
    }, function(Spinor3Animation_1_1) {
      Spinor3Animation_1 = Spinor3Animation_1_1;
    }, function(createFrustum_1_1) {
      createFrustum_1 = createFrustum_1_1;
    }, function(createPerspective_1_1) {
      createPerspective_1 = createPerspective_1_1;
    }, function(createView_1_1) {
      createView_1 = createView_1_1;
    }, function(frustumMatrix_1_1) {
      frustumMatrix_1 = frustumMatrix_1_1;
    }, function(PerspectiveCamera_1_1) {
      PerspectiveCamera_1 = PerspectiveCamera_1_1;
    }, function(perspectiveMatrix_1_1) {
      perspectiveMatrix_1 = perspectiveMatrix_1_1;
    }, function(viewMatrix_1_1) {
      viewMatrix_1 = viewMatrix_1_1;
    }, function(BlendFactor_1_1) {
      BlendFactor_1 = BlendFactor_1_1;
    }, function(WebGLBlendFunc_1_1) {
      WebGLBlendFunc_1 = WebGLBlendFunc_1_1;
    }, function(WebGLClearColor_1_1) {
      WebGLClearColor_1 = WebGLClearColor_1_1;
    }, function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(WebGLDisable_1_1) {
      WebGLDisable_1 = WebGLDisable_1_1;
    }, function(WebGLEnable_1_1) {
      WebGLEnable_1 = WebGLEnable_1_1;
    }, function(AttribLocation_1_1) {
      AttribLocation_1 = AttribLocation_1_1;
    }, function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(UniformLocation_1_1) {
      UniformLocation_1 = UniformLocation_1_1;
    }, function(Curve_1_1) {
      Curve_1 = Curve_1_1;
    }, function(Keyboard_1_1) {
      Keyboard_1 = Keyboard_1_1;
    }, function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(simplicesToGeometryMeta_1_1) {
      simplicesToGeometryMeta_1 = simplicesToGeometryMeta_1_1;
    }, function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(cube_1_1) {
      cube_1 = cube_1_1;
    }, function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(square_1_1) {
      square_1 = square_1_1;
    }, function(tetrahedron_1_1) {
      tetrahedron_1 = tetrahedron_1_1;
    }, function(simplicesToDrawPrimitive_1_1) {
      simplicesToDrawPrimitive_1 = simplicesToDrawPrimitive_1_1;
    }, function(triangle_1_1) {
      triangle_1 = triangle_1_1;
    }, function(Topology_1_1) {
      Topology_1 = Topology_1_1;
    }, function(PointTopology_1_1) {
      PointTopology_1 = PointTopology_1_1;
    }, function(LineTopology_1_1) {
      LineTopology_1 = LineTopology_1_1;
    }, function(MeshTopology_1_1) {
      MeshTopology_1 = MeshTopology_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(Composite_1_1) {
      Composite_1 = Composite_1_1;
    }, function(Scene_1_1) {
      Scene_1 = Scene_1_1;
    }, function(WebGLRenderer_1_1) {
      WebGLRenderer_1 = WebGLRenderer_1_1;
    }, function(AxialSimplexGeometry_1_1) {
      AxialSimplexGeometry_1 = AxialSimplexGeometry_1_1;
    }, function(ArrowGeometry_1_1) {
      ArrowGeometry_1 = ArrowGeometry_1_1;
    }, function(BarnSimplexGeometry_1_1) {
      BarnSimplexGeometry_1 = BarnSimplexGeometry_1_1;
    }, function(ConeGeometry_1_1) {
      ConeGeometry_1 = ConeGeometry_1_1;
    }, function(ConeSimplexGeometry_1_1) {
      ConeSimplexGeometry_1 = ConeSimplexGeometry_1_1;
    }, function(CuboidGeometry_1_1) {
      CuboidGeometry_1 = CuboidGeometry_1_1;
    }, function(CuboidSimplexGeometry_1_1) {
      CuboidSimplexGeometry_1 = CuboidSimplexGeometry_1_1;
    }, function(CylinderGeometry_1_1) {
      CylinderGeometry_1 = CylinderGeometry_1_1;
    }, function(CylinderSimplexGeometry_1_1) {
      CylinderSimplexGeometry_1 = CylinderSimplexGeometry_1_1;
    }, function(DodecahedronSimplexGeometry_1_1) {
      DodecahedronSimplexGeometry_1 = DodecahedronSimplexGeometry_1_1;
    }, function(IcosahedronSimplexGeometry_1_1) {
      IcosahedronSimplexGeometry_1 = IcosahedronSimplexGeometry_1_1;
    }, function(KleinBottleSimplexGeometry_1_1) {
      KleinBottleSimplexGeometry_1 = KleinBottleSimplexGeometry_1_1;
    }, function(Simplex1Geometry_1_1) {
      Simplex1Geometry_1 = Simplex1Geometry_1_1;
    }, function(MobiusStripSimplexGeometry_1_1) {
      MobiusStripSimplexGeometry_1 = MobiusStripSimplexGeometry_1_1;
    }, function(OctahedronSimplexGeometry_1_1) {
      OctahedronSimplexGeometry_1 = OctahedronSimplexGeometry_1_1;
    }, function(SliceSimplexGeometry_1_1) {
      SliceSimplexGeometry_1 = SliceSimplexGeometry_1_1;
    }, function(GridSimplexGeometry_1_1) {
      GridSimplexGeometry_1 = GridSimplexGeometry_1_1;
    }, function(PolyhedronSimplexGeometry_1_1) {
      PolyhedronSimplexGeometry_1 = PolyhedronSimplexGeometry_1_1;
    }, function(RevolutionSimplexGeometry_1_1) {
      RevolutionSimplexGeometry_1 = RevolutionSimplexGeometry_1_1;
    }, function(RingGeometry_1_1) {
      RingGeometry_1 = RingGeometry_1_1;
    }, function(RingSimplexGeometry_1_1) {
      RingSimplexGeometry_1 = RingSimplexGeometry_1_1;
    }, function(SphereGeometry_1_1) {
      SphereGeometry_1 = SphereGeometry_1_1;
    }, function(TetrahedronSimplexGeometry_1_1) {
      TetrahedronSimplexGeometry_1 = TetrahedronSimplexGeometry_1_1;
    }, function(VortexSimplexGeometry_1_1) {
      VortexSimplexGeometry_1 = VortexSimplexGeometry_1_1;
    }, function(smartProgram_1_1) {
      smartProgram_1 = smartProgram_1_1;
    }, function(programFromScripts_1_1) {
      programFromScripts_1 = programFromScripts_1_1;
    }, function(HTMLScriptsGraphicsProgram_1_1) {
      HTMLScriptsGraphicsProgram_1 = HTMLScriptsGraphicsProgram_1_1;
    }, function(LineMaterial_1_1) {
      LineMaterial_1 = LineMaterial_1_1;
    }, function(MeshMaterial_1_1) {
      MeshMaterial_1 = MeshMaterial_1_1;
    }, function(MeshLambertMaterial_1_1) {
      MeshLambertMaterial_1 = MeshLambertMaterial_1_1;
    }, function(PointMaterial_1_1) {
      PointMaterial_1 = PointMaterial_1_1;
    }, function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(Dimensions_1_1) {
      Dimensions_1 = Dimensions_1_1;
    }, function(Euclidean2_1_1) {
      Euclidean2_1 = Euclidean2_1_1;
    }, function(Euclidean3_1_1) {
      Euclidean3_1 = Euclidean3_1_1;
    }, function(mathcore_1_1) {
      mathcore_1 = mathcore_1_1;
    }, function(R1_1_1) {
      R1_1 = R1_1_1;
    }, function(Mat2R_1_1) {
      Mat2R_1 = Mat2R_1_1;
    }, function(Mat3R_1_1) {
      Mat3R_1 = Mat3R_1_1;
    }, function(Mat4R_1_1) {
      Mat4R_1 = Mat4R_1_1;
    }, function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }, function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(SpinG2_1_1) {
      SpinG2_1 = SpinG2_1_1;
    }, function(SpinG3_1_1) {
      SpinG3_1 = SpinG3_1_1;
    }, function(R2_1_1) {
      R2_1 = R2_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(R4_1_1) {
      R4_1 = R4_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(AmbientLight_1_1) {
      AmbientLight_1 = AmbientLight_1_1;
    }, function(ColorFacet_1_1) {
      ColorFacet_1 = ColorFacet_1_1;
    }, function(DirectionalLight_1_1) {
      DirectionalLight_1 = DirectionalLight_1_1;
    }, function(EulerFacet_1_1) {
      EulerFacet_1 = EulerFacet_1_1;
    }, function(ModelFacet_1_1) {
      ModelFacet_1 = ModelFacet_1_1;
    }, function(PointSizeFacet_1_1) {
      PointSizeFacet_1 = PointSizeFacet_1_1;
    }, function(ReflectionFacetE2_1_1) {
      ReflectionFacetE2_1 = ReflectionFacetE2_1_1;
    }, function(ReflectionFacetE3_1_1) {
      ReflectionFacetE3_1 = ReflectionFacetE3_1_1;
    }, function(Vector3Facet_1_1) {
      Vector3Facet_1 = Vector3Facet_1_1;
    }, function(ModelE2_1_1) {
      ModelE2_1 = ModelE2_1_1;
    }, function(ModelE3_1_1) {
      ModelE3_1 = ModelE3_1_1;
    }, function(GraphicsBuffers_1_1) {
      GraphicsBuffers_1 = GraphicsBuffers_1_1;
    }, function(initWebGL_1_1) {
      initWebGL_1 = initWebGL_1_1;
    }, function(getCanvasElementById_1_1) {
      getCanvasElementById_1 = getCanvasElementById_1_1;
    }, function(IUnknownArray_1_1) {
      IUnknownArray_1 = IUnknownArray_1_1;
    }, function(NumberIUnknownMap_1_1) {
      NumberIUnknownMap_1 = NumberIUnknownMap_1_1;
    }, function(refChange_1_1) {
      refChange_1 = refChange_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(StringIUnknownMap_1_1) {
      StringIUnknownMap_1 = StringIUnknownMap_1_1;
    }, function(animation_1_1) {
      animation_1 = animation_1_1;
    }, function(vector_1_1) {
      vector_1 = vector_1_1;
    }, function(RigidBody_1_1) {
      RigidBody_1 = RigidBody_1_1;
    }, function(Ball_1_1) {
      Ball_1 = Ball_1_1;
    }],
    execute: function() {
      eight = {
        get LAST_MODIFIED() {
          return core_1.default.LAST_MODIFIED;
        },
        get fastPath() {
          return core_1.default.fastPath;
        },
        set fastPath(value) {
          core_1.default.fastPath = value;
        },
        get strict() {
          return core_1.default.strict;
        },
        set strict(value) {
          core_1.default.strict = value;
        },
        get verbose() {
          return core_1.default.verbose;
        },
        set verbose(value) {
          if (typeof value === 'boolean') {
            core_1.default.verbose = value;
          } else {
            throw new TypeError('verbose must be a boolean');
          }
        },
        get VERSION() {
          return core_1.default.VERSION;
        },
        get Slide() {
          return Slide_1.default;
        },
        get Director() {
          return Director_1.default;
        },
        get DirectorKeyboardHandler() {
          return DirectorKeyboardHandler_1.default;
        },
        get ColorAnimation() {
          return ColorAnimation_1.default;
        },
        get WaitAnimation() {
          return WaitAnimation_1.default;
        },
        get Vector2Animation() {
          return Vector2Animation_1.default;
        },
        get Vector3Animation() {
          return Vector3Animation_1.default;
        },
        get Spinor2Animation() {
          return Spinor2Animation_1.default;
        },
        get Spinor3Animation() {
          return Spinor3Animation_1.default;
        },
        get Keyboard() {
          return Keyboard_1.default;
        },
        get HTMLScriptsGraphicsProgram() {
          return HTMLScriptsGraphicsProgram_1.default;
        },
        get LineMaterial() {
          return LineMaterial_1.default;
        },
        get MeshMaterial() {
          return MeshMaterial_1.default;
        },
        get MeshLambertMaterial() {
          return MeshLambertMaterial_1.default;
        },
        get PointMaterial() {
          return PointMaterial_1.default;
        },
        get GraphicsProgramBuilder() {
          return GraphicsProgramBuilder_1.default;
        },
        get BlendFactor() {
          return BlendFactor_1.default;
        },
        get Capability() {
          return Capability_1.default;
        },
        get WebGLBlendFunc() {
          return WebGLBlendFunc_1.default;
        },
        get WebGLClearColor() {
          return WebGLClearColor_1.default;
        },
        get WebGLDisable() {
          return WebGLDisable_1.default;
        },
        get WebGLEnable() {
          return WebGLEnable_1.default;
        },
        get initWebGL() {
          return initWebGL_1.default;
        },
        get createFrustum() {
          return createFrustum_1.default;
        },
        get createPerspective() {
          return createPerspective_1.default;
        },
        get createView() {
          return createView_1.default;
        },
        get ModelE2() {
          return ModelE2_1.default;
        },
        get ModelE3() {
          return ModelE3_1.default;
        },
        get EulerFacet() {
          return EulerFacet_1.default;
        },
        get ModelFacet() {
          return ModelFacet_1.default;
        },
        get Simplex() {
          return Simplex_1.default;
        },
        get Vertex() {
          return Vertex_1.default;
        },
        get frustumMatrix() {
          return frustumMatrix_1.default;
        },
        get perspectiveMatrix() {
          return perspectiveMatrix_1.default;
        },
        get viewMatrix() {
          return viewMatrix_1.default;
        },
        get Scene() {
          return Scene_1.default;
        },
        get Composite() {
          return Composite_1.default;
        },
        get PerspectiveCamera() {
          return PerspectiveCamera_1.default;
        },
        get getCanvasElementById() {
          return getCanvasElementById_1.default;
        },
        get WebGLRenderer() {
          return WebGLRenderer_1.default;
        },
        get animation() {
          return animation_1.default;
        },
        get DrawMode() {
          return DrawMode_1.default;
        },
        get AttribLocation() {
          return AttribLocation_1.default;
        },
        get UniformLocation() {
          return UniformLocation_1.default;
        },
        get smartProgram() {
          return smartProgram_1.default;
        },
        get Color() {
          return Color_1.default;
        },
        get AxialSimplexGeometry() {
          return AxialSimplexGeometry_1.default;
        },
        get ArrowGeometry() {
          return ArrowGeometry_1.default;
        },
        get BarnSimplexGeometry() {
          return BarnSimplexGeometry_1.default;
        },
        get ConeGeometry() {
          return ConeGeometry_1.default;
        },
        get ConeSimplexGeometry() {
          return ConeSimplexGeometry_1.default;
        },
        get CuboidGeometry() {
          return CuboidGeometry_1.default;
        },
        get CuboidSimplexGeometry() {
          return CuboidSimplexGeometry_1.default;
        },
        get CylinderGeometry() {
          return CylinderGeometry_1.default;
        },
        get CylinderSimplexGeometry() {
          return CylinderSimplexGeometry_1.default;
        },
        get DodecahedronSimplexGeometry() {
          return DodecahedronSimplexGeometry_1.default;
        },
        get IcosahedronSimplexGeometry() {
          return IcosahedronSimplexGeometry_1.default;
        },
        get KleinBottleSimplexGeometry() {
          return KleinBottleSimplexGeometry_1.default;
        },
        get Simplex1Geometry() {
          return Simplex1Geometry_1.default;
        },
        get MobiusStripSimplexGeometry() {
          return MobiusStripSimplexGeometry_1.default;
        },
        get OctahedronSimplexGeometry() {
          return OctahedronSimplexGeometry_1.default;
        },
        get GridSimplexGeometry() {
          return GridSimplexGeometry_1.default;
        },
        get PolyhedronSimplexGeometry() {
          return PolyhedronSimplexGeometry_1.default;
        },
        get RevolutionSimplexGeometry() {
          return RevolutionSimplexGeometry_1.default;
        },
        get RingGeometry() {
          return RingGeometry_1.default;
        },
        get RingSimplexGeometry() {
          return RingSimplexGeometry_1.default;
        },
        get SliceSimplexGeometry() {
          return SliceSimplexGeometry_1.default;
        },
        get SphereGeometry() {
          return SphereGeometry_1.default;
        },
        get TetrahedronSimplexGeometry() {
          return TetrahedronSimplexGeometry_1.default;
        },
        get VortexSimplexGeometry() {
          return VortexSimplexGeometry_1.default;
        },
        get Topology() {
          return Topology_1.default;
        },
        get PointTopology() {
          return PointTopology_1.default;
        },
        get LineTopology() {
          return LineTopology_1.default;
        },
        get MeshTopology() {
          return MeshTopology_1.default;
        },
        get GridTopology() {
          return GridTopology_1.default;
        },
        get Dimensions() {
          return Dimensions_1.default;
        },
        get Unit() {
          return Unit_1.default;
        },
        get Euclidean2() {
          return Euclidean2_1.default;
        },
        get Euclidean3() {
          return Euclidean3_1.default;
        },
        get Mat2R() {
          return Mat2R_1.default;
        },
        get Mat3R() {
          return Mat3R_1.default;
        },
        get Mat4R() {
          return Mat4R_1.default;
        },
        get QQ() {
          return QQ_1.default;
        },
        get G2() {
          return G2_1.default;
        },
        get G3() {
          return G3_1.default;
        },
        get R1() {
          return R1_1.default;
        },
        get SpinG2() {
          return SpinG2_1.default;
        },
        get SpinG3() {
          return SpinG3_1.default;
        },
        get R2() {
          return R2_1.default;
        },
        get R3() {
          return R3_1.default;
        },
        get R4() {
          return R4_1.default;
        },
        get VectorN() {
          return VectorN_1.default;
        },
        get Curve() {
          return Curve_1.default;
        },
        get simplicesToGeometryMeta() {
          return simplicesToGeometryMeta_1.default;
        },
        get computeFaceNormals() {
          return computeFaceNormals_1.default;
        },
        get cube() {
          return cube_1.default;
        },
        get quadrilateral() {
          return quadrilateral_1.default;
        },
        get square() {
          return square_1.default;
        },
        get tetrahedron() {
          return tetrahedron_1.default;
        },
        get triangle() {
          return triangle_1.default;
        },
        get simplicesToDrawPrimitive() {
          return simplicesToDrawPrimitive_1.default;
        },
        get GraphicsProgramSymbols() {
          return GraphicsProgramSymbols_1.default;
        },
        get GraphicsBuffers() {
          return GraphicsBuffers_1.default;
        },
        get programFromScripts() {
          return programFromScripts_1.default;
        },
        get DrawAttribute() {
          return DrawAttribute_1.default;
        },
        get DrawPrimitive() {
          return DrawPrimitive_1.default;
        },
        get AmbientLight() {
          return AmbientLight_1.default;
        },
        get ColorFacet() {
          return ColorFacet_1.default;
        },
        get DirectionalLight() {
          return DirectionalLight_1.default;
        },
        get PointSizeFacet() {
          return PointSizeFacet_1.default;
        },
        get ReflectionFacetE2() {
          return ReflectionFacetE2_1.default;
        },
        get ReflectionFacetE3() {
          return ReflectionFacetE3_1.default;
        },
        get Vector3Facet() {
          return Vector3Facet_1.default;
        },
        get IUnknownArray() {
          return IUnknownArray_1.default;
        },
        get NumberIUnknownMap() {
          return NumberIUnknownMap_1.default;
        },
        get refChange() {
          return refChange_1.default;
        },
        get Shareable() {
          return Shareable_1.default;
        },
        get StringIUnknownMap() {
          return StringIUnknownMap_1.default;
        },
        get cos() {
          return mathcore_1.default.cos;
        },
        get cosh() {
          return mathcore_1.default.cosh;
        },
        get exp() {
          return mathcore_1.default.exp;
        },
        get log() {
          return mathcore_1.default.log;
        },
        get norm() {
          return mathcore_1.default.norm;
        },
        get quad() {
          return mathcore_1.default.quad;
        },
        get sin() {
          return mathcore_1.default.sin;
        },
        get sinh() {
          return mathcore_1.default.sinh;
        },
        get sqrt() {
          return mathcore_1.default.sqrt;
        },
        get RigidBody() {
          return RigidBody_1.default;
        },
        get Ball() {
          return Ball_1.default;
        },
        get vector() {
          return vector_1.default;
        }
      };
      exports_1("default", eight);
    }
  };
});

//# sourceMappingURL=davinci-eight-system-es5.js.map