/** @jsx $mol_jsx */
namespace $.$$ {

	export class $hyoo_board_group extends $.$hyoo_board_group {
		
		_drag_local = false
		
		@ $mol_mem
		override widgets() {
			return this.links().map( (_,i)=> this.Widget(i) )
		}
		
		override widget_uri( index: number ) {
			return this.links()[ index ].uri
		}
		
		@ $mol_mem_key
		override widget_title( index: number ) {
			const data = this.links()[ index ]
			return data.title || data.uri
		}
		
		override widget_html( index: number ) {
			return (<a href={ this.widget_uri( index ) }>{ this.widget_title( index ) }</a>).outerHTML
		}
		
		override link_receive( index: number, next: $hyoo_board_link[] ) {
			
			const links0 = this.links()
			const pre = links0.slice( 0, index ).filter( l => !next.find( n => l.uri === n.uri ) )
			const post = links0.slice( index ).filter( l => !next.find( n => l.uri === n.uri ) )
			const links = [ ... pre, ... next, ... post ]
			
			if( links.length !== links0.length + next.length ) {
				this._drag_local = true
				setTimeout( ()=> this._drag_local = false )
			}
			
			this.links( links )
		}
		
		override link_drag_end( index: number, event: DragEvent ) {
			if( this._drag_local ) return
			if( event.dataTransfer?.dropEffect !== 'move' ) return
			const links = this.links().slice()
			links.splice( index, 1 )
			this.links( links )
		}
		
	}
}
