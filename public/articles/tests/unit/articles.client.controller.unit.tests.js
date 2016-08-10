describe('Testing articles controller', function() {
    var _scope, ArticlesController;

    beforeEach(function() {
        module('mean');

        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        return {
                            pass: angular.equals(actual, expected)
                        }
                    }
                }
            }
        });

        inject(function($rootScope, $controller) {
            _scope = $rootScope.$new();
            ArticlesController = $controller('ArticlesController', {
                $scope: _scope
            });
        });
    });

    it('Should have a find method that uses $resource to retrieve a list of articles', inject(function(Articles) {
        inject(function($httpBackend) {
            var sampleArticle = new Articles({
                title: 'An article about MEAN',
                content: 'angular1 sucks'
            });
            var sampleArticles = [sampleArticle];

            $httpBackend.expectGET('api/articles').respond(sampleArticles);

            _scope.find();
            $httpBackend.flush();

            expect(_scope.articles).toEqualData(sampleArticles);
        });
    }));
});