
describe 'Utility'
  describe 'stubbing'
    before_each
      Object.prototype.stubby = function() { return 'Not stubbed' }
      object = { toString : function() { return '<Im an object>' }}
      stub(object, 'stubby').and_return('Im stubbed')
      stub(object, 'toString').and_return('<No im not>')
    end

    describe 'stub()'
      it 'should stub :)'
        object.stubby().should.eql 'Im stubbed'
        object.toString().should.eql '<No im not>'
      end
      
      it 'should allow being called as a core prototype method'
        foo = { bar : function(){ return 'baz' }}
        foo.stub('bar').and_return('something else')
        foo.bar().should.eql 'something else'
        foo.destub()
        foo.bar().should.eql 'baz'
      end
    end
    
    describe 'destub()'
      it 'should restore old methods'
        destub(object, 'toString')
        destub(object, 'stubby')
        object.toString().should.eql '<Im an object>'
        object.stubby().should.eql 'Not stubbed'
      end
      
      it 'should restore prototypal methods'
        Object.prototype.stubby = function() { return 'Oh no im new' }
        destub(object, 'stubby')
        object.stubby().should.eql 'Oh no im new'
      end
      
      it 'should destub all methods stubbed related to the object passed when no method is given'
        destub(object)
        object.toString().should.eql '<Im an object>'
        object.stubby().should.eql 'Not stubbed'
      end
      
      describe 'should restore after each spec'
        before
          a = { toString : function(){ return 'Wahoo' }}
          b = { toString : function(){ return 'Wahhhhhooo' }}
        end
        
        it 'should stub'
          stub(a, 'toString').and_return('Oh no')
          stub(b, 'toString').and_return('Oh noooo')
          a.toString().should.eql 'Oh no'
          b.toString().should.eql 'Oh noooo'
        end
        
        it 'should restore'
          a.toString().should.eql 'Wahoo'
          b.toString().should.eql 'Wahhhhhooo'
        end
      end
    end
  end
  
  describe 'query()'
    it 'should return a pairs value'
      query('suite', '?suite=Positive%20specs').should.equal 'Positive specs'
    end
    
    it 'should return null when key is not present'
      query('foo', '?suite=Positive%20specs').should.be_null
    end
  end
  
  describe 'strip()'
    it 'should strip whitespace by default'
      strip(" foo \n\n").should.equal 'foo'
    end
    
    it 'should strip the characters passed'
      strip('[foo]', '\\[\\]').should.equal 'foo'
    end
  end
  
  describe 'each()'
    it 'should iterate an array'
      result = []
      each([1,2,3], function(value){
        result.push(value)
      })
      result.should.eql [1,2,3]
    end
    
    it 'should iterate words in a string'
      result = []
      each('some foo bar', function(value){
        result.push(value)
      })
      result.should.eql ['some', 'foo', 'bar']
    end
  end
  
  describe 'map()'
    it 'should return an array of mapped values'
      result = map([1,2,3], function(value){
        return value * 2
      })
      result.should.eql [2,4,6]
    end
    
    it 'should inherit the ability to iterate words in a string'
      result = map('some foo bar', function(i, value){
        return i + '-' + value
      })
      result.should.eql ['0-some', '1-foo', '2-bar']
    end
  end
  
  describe 'inject()'
    it 'should provide a memo object while iterating, not expecting returning of memo for composits'
      result = inject([1,2,3], [], function(memo, value){
        memo.push(value)
      })
      result.should.eql [1,2,3]
    end
    
    it 'should require returning of memo for scalar variables'
      result = inject([1,2,3], false, function(memo, value){
        return memo ? memo : value == 2
      })
      result.should.be_true
    end
  end
  
  describe 'any()'
    it 'should return null when no matches are found'
      result = any('some foo bar', function(value){
        return value.length > 5
      })
      result.should.be_null
    end
    
    it 'should return the value of the first matching expression'
      result = any('foo some bar', function(value){
        return value.length > 3
      })
      result.should.eql 'some'
    end
  end
  
  describe 'select()'
    it 'should return an array of values when the callback evaluates to true'
      result = select('some foo bar baz stuff', function(value){
        return value.length > 3
      })
      result.should.eql ['some', 'stuff']
    end
  end
  
  describe 'last()'
    it 'should return the last element in an array'
      last(['foo', 'bar']).should.eql 'bar'
    end
  end
  
  describe 'argumentsToArray()'
    it 'should return an array of arguments'
      func = function(){ return argumentsToArray(arguments) }
      func('foo', 'bar').should.eql ['foo', 'bar']
    end
    
    it 'should return the offset of an arguments array'
      func = function(){ return argumentsToArray(arguments, 2) }
      func('foo', 'bar', 'baz').should.eql ['baz']
    end
  end
  
  describe 'does()'
    it 'should assert without reporting'
      does('foo', 'eql', 'foo')
      JSpec.currentSpec.assertions.should.have_length 0
    end
  end
  
  describe 'contentsOf()'
    it 'should return a function body'
      JSpec.contentsOf(-{ return 'foo' }).should.include 'return', 'foo'
    end
  end
end