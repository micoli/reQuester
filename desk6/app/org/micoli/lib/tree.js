Ext.define('Ext.org.micoli.lib.tree',{
	statics : {
		getDeepAllChildNodes : function(node){
			var allNodes = [];
			var addNo = function(nod){
				if(!Ext.value(nod,false)){
					return;
				}
				allNodes.push(nod);
				/*if(nod.renderChildren){
					nod.renderChildren(true);
				}*/
				if(nod.childNodes && nod.childNodes.length>0){
					for(var i=0;i<nod.childNodes.length;i++){
						addNo(nod.childNodes[i]);
					}
				}
			};
			addNo(node);
			//console.log(allNodes.length,allNodes);
			return allNodes;
		},

		findDeepChildNode : function(node,property,value){
			var that = this;
			var tmp = Ext.org.micoli.lib.tree.getDeepAllChildNodes(node);
			for(var i in tmp){
				if(tmp[i].hasOwnProperty(property) && tmp[i][property]==value){
					return tmp[i];
				}
			}
			return false;
		},

		findDeepChildNodeByAttributes : function(node,property,value){
			var that = this;
			var results=[];
			var tmp = Ext.org.micoli.lib.tree.getDeepAllChildNodes(node);
			for(var i in tmp){
				if(tmp.hasOwnProperty(i)){
					if(tmp[i].hasOwnProperty('attributes') && tmp[i].attributes.hasOwnProperty(property) && tmp[i].attributes[property]==value){

						results.push(tmp[i]);
					}
				}
			}
			return results;
		},

		/*findDeepChildNode : function(node,property,value){
			var that = this;
			var tmp = Ext.org.micoli.lib.tree.getDeepAllChildNodes(node);
			var res = false;
			Ext.each(tmp,function(it){
				if(it.hasOwnProperty(property) && it[property]==value){
					res=it;
					return false;
				}
			});
			return res;
		}
		*/
		eachChildren : function(tree,fn,childrenPropertyName){
			childrenPropertyName = childrenPropertyName||'children';
			var fnRecurs = function(node,parent,key){
				var res = fn(node,parent,key);
				if(res!==false){
					if(node && Ext.isArray(node[childrenPropertyName])){
						Ext.each(node[childrenPropertyName],function(v,k){
							fnRecurs(v,node[childrenPropertyName],k);
						});
					}
				}
			};

			if(tree[childrenPropertyName]){
				fnRecurs(tree,tree,null);
			}else{
				for(var t in tree){
					if(tree.hasOwnProperty(t)){
						fnRecurs(tree[t],tree,t);
					}
				}
			}
			return tree;
		},

		deepCopy : function(p, c) {
			c = c || (p.constructor === Array ? [] : {});
			for (var i in p) {
				if (typeof p[i] === 'object' && p[i] !== null) {
					c[i] = p[i].constructor === Array ? [] : {};
					Ext.org.micoli.lib.tree.deepCopy(p[i], c[i]);
				} else {
					c[i] = p[i];
				}
			}
			return c;
		},

		loadTree : function(tree,children){
			var root = tree.getRootNode();
			while(root.firstChild) {
				root.removeChild(root.firstChild);
			}
			Ext.each(children,function(n){
				root.appendChild(n)
			});
		},

		dynFilterTree : function (tree,val,fn){
			if(!fn){
				var re = new RegExp(val,'i');
				var fn = function(node){
					return node.data.text.match(re);
				}
			}
			var store = tree.getStore();
			store.clearFilter();
			if(val){
				var match=[];
				var pushIfNot = function (n){
					if(match.indexOf(n)==-1){
						match.push(n);
					}
				}
				tree.getRootNode().cascadeBy(function(node){
					if(fn(node)){
						pushIfNot(node);
						node.bubble(function(n){
							pushIfNot(n);
						})
					}
				});
				store.filterBy(function(node){
					if(match.indexOf(node)!=-1){
						return true;
					}
					return false;
				});
			}

		},

		filterTree : function (tree,val,fn,textProperty){
			textProperty = textProperty || 'text';
			fn = fn || function(vval,node){
				return vval && node.data[textProperty].toLowerCase().indexOf(vval)!=-1;
			};

			var setBold = function(node,force){
				if(!node.data.hasOwnProperty('originalText')){
					node.originalText = node.data[textProperty]
				}
				if(force){
					node.set('title','<b>'+node.originalText+'</b>');
				}else{
					node.set('title',node.originalText);
				}
			};
			tree.getRootNode().cascadeBy(function(node){
				var test = fn(val,node)
				setBold(node,test);
				if(test){
					node.bubble(function(node2){
						setBold(node2,true);
					});
				}
			});
		}
	}
});
