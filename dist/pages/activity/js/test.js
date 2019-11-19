'use strict';

;(function () {

    /**
     *
     */
    Vue.component('todo-item', {
        props: ['todo'],
        template: '<li @click="test(todo)">{{ todo.text }}</li>',
        methods: {
            test: function test(data) {
                console.log(data);
            }
        }
    });

    /**
     *
     */
    Vue.component('todo-item', {
        props: ['todo'],
        template: '<li @click="test(todo)">{{ todo.text }}</li>',
        methods: {
            test: function test(data) {
                console.log(data);
            }
        }
    });
})();