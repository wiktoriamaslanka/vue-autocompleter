Vue.component('v-autocompleter', {
    template: `
      <div class="vue-autocompleter">  
        <input
          ref="first"
          :value="value"
          type="text"
          class="search_input"
          @input="$emit('input', $event.target.value)"
          @keyup.down="downClick"
          @keyup.up="upClick"
          @keyup.enter="enterClick" />
        <div class="bottom_border"></div>
        <div class="list">
          <ul v-for="(city, index) in filteredCities">
            <li v-on:click="listClicked(city.name)" :class="{grey_content: index == list_counter}">
              <a v-on:click="choose(index)" v-html="boldCity(city)"></a>
            </li>
          </ul>
        </div>
      </div>
      `,
  
    props: [    
      'value', 
      'options'],
  
    data: function () {
      return {
        selected_city: '',
        googleSearch_temp: '',
        cities_update: true,
        change_class: 0,
        cities: window.cities,
        list_counter: -1,
        foc: true,
        filteredCities: []
      }
    },
    
    watch: {
      list_counter: function(){
        this.cities_update = false;      
        if (this.list_counter >= 0) {
          this.$emit('input', this.filteredCities[this.list_counter].name);
        }
      },
      value: function(){
        if(this.value.length == 0){
          this.filteredCities = [];
        } 
        else{ 
          this.cities_update=true;
          if(this.list_counter == -1){
            this.googleSearch_temp = this.value; 
            this.CreateCities();     
          }
        }
      },
    },
  
    methods: {
      CreateCities(){
            let result = this.cities.filter(city => city.name.includes(this.value));
            if(result.length > 10){
              this.filteredCities = result.slice(1, 11);
            }
            else{
              this.filteredCities = result;
            }
          this.list_counter = -1;
      },
  
      listClicked(name){
          this.$emit('input', this.value);
          this.enterClick();
      },
          
      /**
       * @param {pozycja wybranego miasta na liście} i 
       */
      choose(i){
          this.$emit('input', this.filteredCities[i].name);
      },
  
      /**
       * @param {*} event 
       */
      enterClick: function(event) {
        if(event) {
          this.CreateCities();
          this.list_counter = -1;
        }
        this.$emit('enter', this.value);
      },
  
      
      upClick() {
        if(this.list_counter > -1){
          this.list_counter -= 1;
        } else if(this.list_counter == 0) {
          this.list_counter = this.filteredCities.length - 1;
        }
      },
  
      
      downClick() {
        if(this.list_counter < this.filteredCities.length - 1){
          this.list_counter += 1;
        }
        else if(this.list_counter == this.filteredCities.length - 1){
          this.list_counter = -1;
        }
      },
  
      /** 
       * @param {modyfikowana fraza} input_city 
       * @returns 
       */
      boldCity(input_city){
        let regex = new RegExp(this.googleSearch_temp, "gi");
        let bold = "<b>" + 
          input_city.name.replace(regex, match =>
              {return "<span class='thin'>"+ match +"</span>";}) 
                  + "</b>";
        return bold;
      }
    },
  })